<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useChartStore } from '@/modules/chart/store';

import ChartBreadcrumbs from './chart-breadcrumbs.vue';
import TickerImageItem from './assets/ticker-image-item.vue';
import ChartStockInfo from './chart-stock-info.vue';
import ChartPriceInfo from '../common/components/chart-price-info/chart-price-info.vue';

const { randomizeExchanges } = useChartStore();
const { bgColor, bgColorShadow } = storeToRefs(useChartStore());
</script>

<template>
	<div :class="classes.header">
		<div :class="classes.logo" @click="randomizeExchanges">
			<ticker-image-item :fill="bgColor" />
		</div>

		<div :class="classes.market">
			<chart-breadcrumbs />
			<chart-stock-info />
		</div>
		<div class="market-price">
			<chart-price-info />
		</div>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 12px 0;
	gap: 12px;
}

.logo {
	position: relative;
	width: 80px;
	height: 80px;
	padding: 15px;
	background: rgb(228 228 231 / 4%);
	border-radius: 80px;
	box-shadow: -1.441px 1.441px 0 0 rgb(255 255 255 / 40%) inset;
	cursor: pointer;
	user-select: none;
}

.logo::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 330%;
	height: 150%;
	background: rgb(v-bind(bgColorShadow) 16%);
	transform: translate(-22%, -30%);
	filter: blur(88px);
	pointer-events: none;
}

.market {
	display: flex;
	flex-direction: column;
	gap: 3px;
	padding: 0 16px;
}
</style>
