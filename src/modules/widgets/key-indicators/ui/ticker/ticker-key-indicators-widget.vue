<script setup lang="ts">
import { computed } from 'vue';

import { useQueryKeyIndicators } from '../../query/use-query-key-indicators';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { FALLBACK_LOCALE } from '@/shared/lib';

import KeyIndicatorsLoading from '../key-indicators-loading.vue';
import KeyIndicatorsError from '../key-indicators-error.vue';
import KeyIndicatorsWrapper from '../key-indicators-wrapper.vue';
import KeyIndicatorRow from '../key-indicators-row.vue';

const props = defineProps<{
	meta: ITickerWidgetMeta;
}>();

const { data, isLoading, isError } = useQueryKeyIndicators(() => ({
	ticker_id: props.meta.tickerId,
}));

const summarizedLabel = computed(() => {
	if (!data.value) {
		return '';
	}

	if (!data.value.summarized_date) {
		return data.value.summarized || '';
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
	<template v-if="isLoading">
		<key-indicators-loading />
	</template>

	<template v-else-if="data && !isError">
		<key-indicators-wrapper>
			<template #indicators>
				<key-indicator-row
					v-for="(item, index) in data.indicators"
					:key="index"
					:indicator="item"
				/>
			</template>

			<template #summarized>
				{{summarizedLabel}}
			</template>
		</key-indicators-wrapper>
	</template>

	<template v-else>
		<key-indicators-error />
	</template>
</template>

<style module="classes">

</style>
