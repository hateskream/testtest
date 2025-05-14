<script setup lang="ts">
import { ref } from 'vue';

import { useChartStore } from '@/modules/chart/store';

import ChartBreadcrumbs from './chart-breadcrumbs.vue';
import TickerImageItem from './assets/ticker-image-item.vue';
import ChartStockInfo from './chart-stock-info.vue';
import ChartPriceInfo from './chart-price-info.vue';


const bgColor = ref('230, 23, 53');
const {randomizeExchanges} = useChartStore()
const generateRandomColor = () => {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	bgColor.value = `${r}, ${g}, ${b}`;
};

const generate = () => {
	randomizeExchanges();
	generateRandomColor()
}


</script>

<template>
	<div :class="classes.header">
		<div :class="classes.logo" @click="generate">
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
	height: 250%;
	background: rgb(v-bind(bgColor) 33%);
	transform: translate(-22%, -30%);
	filter: blur(88px);
	pointer-events: none;
}

.market {
	display: flex;
	flex-direction: column;
	gap: 3px;
}
</style>
