<script setup lang="ts">
import { computed } from 'vue';

import { UiText } from '@/shared/ui/text';
import { TickerBaseTabSection } from '@/modules/ticker';
import { useQueryEconomicOutline } from '../../query/use-query-economic-outline';
import { FALLBACK_LOCALE } from '@/shared/lib';

import EconomicOutlineLoading from '../economic-outline-loading.vue';
import EconomicOutlineError from '../economic-outline-error.vue';

const props = defineProps<{
	meta: {
		tickerId: string;
	};
}>();

const { data, isLoading, isError } = useQueryEconomicOutline(() => ({
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
</script>

<template>
	<economic-outline-loading v-if="isLoading" />

	<ticker-base-tab-section v-else-if="data && !isError">
		<template #title>
			The economic outline is
		</template>
		<template #tags>
			<div :class="[classes.status, classes[data.status]]">
				<ui-text token="text-200-r">
					{{data.status}}
				</ui-text>
			</div>
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

	<economic-outline-error v-else />
</template>

<style module="classes">
.text {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.summarized {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.status {
	display: flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	padding: var(--tile-padding-md-gap, 3px) var(--tile-padding-md-out, 6px);
	text-transform: capitalize;
	border-radius: var(--radius-radius-s9-16, 6px);
	gap: var(--tile-padding-md-gap, 3px);
}

.status.neutral {
	color: var(--text-500, rgb(255 255 255 / 96%));
	background-color: var(--base-base-80, rgb(73 73 80 / 22%));
}

.status.optimistic {
	color: var(--success-success-00, #04eda0);
	background-color: var(--success-success-90, rgb(4 237 160 / 10%));
}

.status.pessimistic {
	color: var(--warning-warning-00, #fc1d4d);
	background-color: var(--warning-success-90, rgb(252 29 77 / 10%));
}
</style>
