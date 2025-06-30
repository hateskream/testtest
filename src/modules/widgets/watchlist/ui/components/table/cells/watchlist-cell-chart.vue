<script setup lang="ts">
import type { IWatchlistSvgChartCell } from '../../../../model';

interface IProps {
	cell: IWatchlistSvgChartCell;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.chartContainer">
		<img
			v-if="props.cell.src"
			:src="props.cell.src"
			:class="classes.chartImage"
			alt="Chart"
		/>
		<span v-else :class="classes.noChart">—</span>
	</div>
</template>

<style module="classes">
.chartContainer {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 32px;
}

.chartImage {
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
}

.noChart {
	font-size: 14px;
	color: var(--text-color-base-300);
}
</style>
