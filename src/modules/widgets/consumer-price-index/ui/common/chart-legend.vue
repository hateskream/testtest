<script setup lang="ts">
interface IChartLegend {
	items: {
		label: string;
		color: string;
	}[];
}

const props = defineProps<IChartLegend>();
</script>

<template>
	<div :class="classes.container">
		<div
			v-for="(item, index) in props.items"
			:key="index"
			:class="classes.item"
		>
			<span :class="classes.dot" :style="{ backgroundColor: item.color }"></span>
			<span>{{ item.label }}</span>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
	gap: 32px;
}

.item {
	display: flex;
	align-items: center;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-100-r-size, 11px);
	line-height: 180%;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.088px;
	gap: 4px;
}

.dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
}
</style>
