<script setup lang="ts">
import { computed } from 'vue';

import { UiText } from '@/shared/ui/text';
import { UiTag } from '@/shared/ui/tag';
import { type ITickerWidgetMeta, TickerBaseTabSection } from '@/modules/ticker';
import { useQueryEconomicOutline } from '../../query/use-query-economic-outline';
import { FALLBACK_LOCALE } from '@/shared/lib';

import EconomicOutlineLoading from '../economic-outline-loading.vue';
import EconomicOutlineError from '../economic-outline-error.vue';

const props = defineProps<{
	meta: ITickerWidgetMeta;
}>();

const { data, isLoading, isError, refetch } = useQueryEconomicOutline(() => ({
	tickerId: props.meta.tickerId,
}));

const summarizedLabel = computed(() => {
	if (!data.value) {
		return '';
	}

	const date = new Date(data.value.summarized_date);
	const now = new Date();
	const isToday = date.toDateString() === now.toDateString();

	const time = date.toLocaleTimeString(FALLBACK_LOCALE, { hour: '2-digit', minute: '2-digit', hour12: false });

	if (isToday) {
		return `Summarized at ${time}`;
	}

	const day = date.getDate();
	const month = date.toLocaleDateString(FALLBACK_LOCALE, { month: 'long' });
	const year = date.getFullYear() !== now.getFullYear() ? ` ${date.getFullYear()}` : '';

	return `Summarized at ${day} ${month}${year} ${time}`;
});

const uiTagColor = computed(() => {
	const value = data.value?.status;

	if (value === 'optimistic') {
		return 'positive';
	}

	if (value === 'pessimistic') {
		return 'negative';
	}

	return 'neutral';
});
</script>

<template>
	<economic-outline-loading v-if="isLoading" />

	<ticker-base-tab-section v-else-if="data && !isError">
		<template #title>
			The economic outline is
		</template>
		<template #tags>
			<ui-tag :class="classes.status" :color="uiTagColor">
				{{data.status}}
			</ui-tag>
		</template>
		<template #content>
			<ui-text token="text-200-r" :class="classes.text">
				{{data.text}}
			</ui-text>

			<ui-text token="text-100-r" :class="classes.summarized">
				{{summarizedLabel}}
			</ui-text>
		</template>
	</ticker-base-tab-section>

	<economic-outline-error v-else @retry="refetch" />
</template>

<style module="classes">
.text {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.summarized {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.status {
	text-transform: capitalize;
}
</style>
