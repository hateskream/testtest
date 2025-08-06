<script setup lang="ts">
import { computed } from 'vue';

import type { RangeChart } from './types';

interface IChartRangeProps {
	activeRange: RangeChart;
	list: RangeChart[];
	type?: 'default' | 'light';
}

const props = withDefaults(defineProps<IChartRangeProps>(), {
	type: 'default',
});

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
	<div :class="['range', `range-${type}`]">
		<div
			v-for="item in ranges"
			:key="item.val"
			:class="['rangeItem', { ['rangeItemActive']: activeRange === item.val }]"
			@click="emits('select', item.val)"
		>
			<span class="rangeTitle">{{ item.title }}</span>
			<span v-if="type === 'default'" class="rangeChange">{{ item.num }}%</span>
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


.range-light {
	padding: 16px 0;
	background-color: inherit;
	border-top: 1px solid rgb(97 97 97 / 30%);
	border-radius: 0;
}

.range-light .rangeItem {
	background-color: inherit !important;
}

.range-light .rangeItemActive .rangeTitle {
	color: #ffffff;
}

.range-light .rangeTitle {
	font-size: 15px;
	color: var(--text-color-base-300);
}
</style>
