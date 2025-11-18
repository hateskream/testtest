<script setup lang="ts">
import { computed } from 'vue';

import { LayoutComponent } from '@/modules/layout';
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
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<chart-component :id="props.id" :type="tickerType" />
		</template>
	</layout-component>
</template>
