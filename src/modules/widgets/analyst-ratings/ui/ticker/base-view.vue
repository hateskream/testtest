<script setup lang="ts">
import { computed } from 'vue';

import { BaseAnalystRatings, StockAnalystRatings } from './analyst-ratings';
import { resolveMarketTypeFromTicker } from '@/modules/cell';
import { type AnalystRatings } from '../../model';
import type { ITickerWidgetMeta } from '@/modules/ticker';

interface IProps {
	data: AnalystRatings;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();

const marketType = computed(() => resolveMarketTypeFromTicker(props.meta.tickerId));

const marketAnalystRatingsComponent = computed(() => {
	const type = marketType.value;
	if (!type) {
		return BaseAnalystRatings;
	}

	return StockAnalystRatings;
});
</script>
<template>
	<market-analyst-ratings-component :data="props.data" :meta="props.meta" />
</template>
