<script setup lang="ts">
import { ref } from 'vue';

import { RangeChart } from '../model/chart';

interface IChartRangeProps {
	activeRange: RangeChart;
}

defineProps<IChartRangeProps>();

interface IChartRangeEmits {
	(e: 'select', data: RangeChart): void;
}

const emits = defineEmits<IChartRangeEmits>();

const ranges = ref(Object.entries(RangeChart).map(([title, val])=> ({
	title,
	val,
})));


</script>

<template>
	<div :class="classes.range">
		<div
			v-for="item in ranges"
			:key="item.val"
			:class="[classes.rangeItem, { [classes.rangeItemActive]: activeRange === item.val }]"
			@click="emits('select', item.val)"
		>
			{{ item.title }}
		</div>
	</div>
</template>


<style module="classes">
.range {
	display: flex;
	align-items: center;
	width: max-content;
	padding: 2px;
	background-color: rgb(50 50 52 / 50%);
	border-radius: 14px;
}

.rangeItem {
	min-width: 130px;
	padding: 6px 8px;
	text-align: center;
	border-radius: 16px;
	cursor: pointer;
}

.rangeItemActive {
	background-color: var(--bg-color-base-300-activated);
}


</style>
