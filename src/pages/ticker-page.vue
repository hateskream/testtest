<script setup lang="ts">
import { computed } from 'vue';

import { AppLayout } from '@/modules/layout';
import { ChartComponent } from '@/modules/chart';
import { RouteTickerType } from '@/types/route.d';
import { TickerType } from '@/modules/chart/models';

interface ITickerPageProps {
	id: number;
	type: RouteTickerType;
}

const props = defineProps<ITickerPageProps>();

const tickerType = computed((): TickerType => {
	const mapping: Record<RouteTickerType, TickerType> = {
		[RouteTickerType.CRYPTO]: TickerType.CRYPTO,
		[RouteTickerType.STOCK]: TickerType.STOCK,
		[RouteTickerType.FOREX]: TickerType.FOREX,
		[RouteTickerType.COMMODITIES]: TickerType.COMMODITIES,
		[RouteTickerType.INDICES]: TickerType.INDICES,
		[RouteTickerType.ETF]: TickerType.ETF,
	};

	return mapping[props.type];
});

// TODO: useAppHead with resolver ticker name
</script>

<template>
	<app-layout>
		<div :class="classes.container">
			<chart-component :id="props.id" :type="tickerType" />
		</div>
	</app-layout>
</template>

<style module="classes">
.container {
	padding: 20px;
}
</style>
