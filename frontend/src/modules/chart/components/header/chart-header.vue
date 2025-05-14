<script setup lang="ts">
import { ref } from 'vue';

import ChartBreadcrumbs from './chart-breadcrumbs.vue';
import TickerImageItem from './assets/ticker-image-item.vue';
import ChartStockInfo from '@/modules/chart/components/header/chart-stock-info.vue';

const bgColor = ref('230, 23, 53');

const generateRandomColor = () => {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	bgColor.value = `${r}, ${g}, ${b}`;
};
</script>

<template>
	<div :class="classes.header">
		<div :class="classes.logo" @click="generateRandomColor">
			<ticker-image-item :fill="bgColor" />
		</div>

		<div :class="classes.market">
			<chart-breadcrumbs />
			<chart-stock-info />
		</div>
		<div class="market-price">
			3
		</div>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	gap: 12px;
	justify-content: flex-start;
	align-items: center;
}

.logo {
	padding: 15px;
	width: 80px;
	height: 80px;
	border-radius: 80px;
	background: rgba(228, 228, 231, 0.04);
	box-shadow: -1.441px 1.441px 0 0 rgba(255, 255, 255, 0.40) inset;
	position: relative;
	cursor: pointer;
	user-select: none;
}

.logo:after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(-22%, -30%);
	width: 330%;
	height: 250%;
	background: rgba(v-bind(bgColor), 33%);
	filter: blur(88px);
	pointer-events: none;
}

.market {
	display: flex;
	flex-direction: column;
	gap: 3px;
}
</style>
