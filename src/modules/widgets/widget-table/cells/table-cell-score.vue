<script setup lang="ts">
import { computed } from 'vue';

import type { ITableScoreCell } from '../model';

interface IProps {
	data: ITableScoreCell;
}

const props = defineProps<IProps>();

const totalBars = 10;


const barHeights = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22];


const getColor = computed(() => {
	const { score } = props.data;
	if (score >= 9) {
		return '#00D68F';
	}
	if (score >= 6) {
		return '#FFFFFF';
	}
	if (score >= 4) {
		return '#FF8A00';
	}
	return '#FF4757';
});
</script>

<template>
	<div :class="classes.chartContainer">
		<div :class="classes.barsWrapper">
			<div
				v-for="i in totalBars"
				:key="i"
				:class="classes.bar"
				:style="{
					height: `${barHeights[i - 1]}px`,
					backgroundColor: i <= props.data.score ? getColor : '#4A4A4A'
				}"
			/>
		</div>
		<span :class="classes.value">{{ props.data.value }}</span>
	</div>
</template>

<style module="classes">
.chartContainer {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
	width: 100%;
	height: 32px;
}

.barsWrapper {
	display: flex;
	align-items: flex-end;
	gap: 1px;
	height: 24px;
}

.bar {
	width: 3px;
	border-radius: 1px;
	transition: background-color 0.2s ease;
}

.value {
	min-width: 20px;
	font-weight: 500;
	font-size: 14px;
	text-align: right;
	color: #ffffff;
}

.noChart {
	font-size: 14px;
	color: var(--text-color-base-300);
}
</style>
