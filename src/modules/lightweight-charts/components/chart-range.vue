<script setup lang="ts">
import { computed } from 'vue';

import { RangeChart } from '../model/chart';

interface IChartRangeProps {
	activeRange: RangeChart;
	list: RangeChart[];
}

const props = defineProps<IChartRangeProps>();

interface IChartRangeEmits {
	(e: 'select', data: RangeChart): void;
}

const emits = defineEmits<IChartRangeEmits>();

const ranges = computed(() => {
	return props.list.map((item) => ({
		title: item,
		val: item,
		num: generateRandom(),
	}));
});

function generateRandom() {
	return (Math.random() * (32 - 1) + 1).toFixed(2);
}

</script>

<template>
	<div :class="'range'">
		<div
			v-for="item in ranges"
			:key="item.val"
			:class="['rangeItem', { ['rangeItemActive']: activeRange === item.val }]"
			@click="emits('select', item.val)"
		>
			<span class="rangeTitle">{{ item.title }}</span>
			<span class="rangeChange">{{ item.num }}%</span>
		</div>
	</div>
</template>


<style scoped>
.range {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 2px;
	background-color: rgb(50 50 52 / 50%);
	border-radius: 14px;
}

.rangeChange {
	font-weight: 440;
	font-size: 10px;
	color: rgb(4 237 160 / 100%);
}

.rangeItem:nth-child(2n) .rangeChange {
	color: rgb(252 74 107 / 100%);
}

.rangeTitle {
	font-weight: 440;
	font-size: 12px;
}

.rangeItem {
	display: flex;
	flex: auto;
	justify-content: center;
	align-items: center;
	padding: 6px 8px;
	text-align: center;
	border-radius: 16px;
	cursor: pointer;
	gap: 4px;
}

.rangeItemActive {
	background-color: var(--bg-color-base-300-activated);
}
</style>
