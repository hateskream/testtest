<script setup lang="ts">
import { computed } from 'vue';

import { AppLayout } from '@/modules/layout';
import { TickerComponent } from '@/modules/ticker';
import { RouteTickerType } from '@/types/route.d';
import { TickerType } from '@/modules/ticker/models';

interface ITickerPageProps {
	id: string;
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
			<ticker-component :id="props.id" :type="tickerType" />
		</div>
	</app-layout>
</template>

<style module="classes">
.container {
	height: calc(100vh - 16px);
	margin: 8px 0;
	border-radius: 18px;

	@media (width > 655px) {
		border: 1px solid #1d1d1e;
	}
}
</style>
