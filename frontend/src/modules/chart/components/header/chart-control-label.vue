<script setup lang="ts">
import { computed } from 'vue';

import PriceChangeIcon from './assets/price-change-icon.vue';

const {change} = defineProps<{
	change:{
		points:number;
		percentage:number;
	};
}>();

const priceText = computed(()=>{
	return `${change.points.toFixed(2)} (${Math.abs(change.percentage).toFixed(2)}%)`
})
</script>

<template>
	<div :class="[classes.wrapper, change.points >= 0 ? classes.positive : classes.negative]" class="paragraph-p01">
		<div :class="classes.symbol">
			<price-change-icon :is-negative="change.points < 0" />
		</div>
		<div :class="classes.price">
			{{ priceText }}
		</div>
	</div>
</template>

<style module="classes">
.wrapper{
	display:flex;
	gap:3px;
	align-items:center;
	padding:5px 11px 5px 6px;
	border-radius: 99px;
	background-color: var(--metrics-bg-control-300);
	width:fit-content;
}
.symbol {
	width:16px;
	height:16px;
}
.positive {
	color: var(--metrics-color-positive-chart);
}
.negative {
	color: var(--metrics-color-negative-chart);
}
</style>
