<script setup lang="ts">
import { UiLegend, UiLegendOption, UiLegendRow } from '@/shared/ui/legend';
import type { EpsQuarter } from '../../model';
import { EpsChart } from '../common';

interface IViewComponentProps {
	quarters: EpsQuarter[];
}

const props = defineProps<IViewComponentProps>();
</script>

<template>
	<div :class="classes.content">
		<div :class="classes.chart">
			<eps-chart
				:quarters="props.quarters"
				:height="170"
			/>
		</div>
		<ui-legend>
			<ui-legend-row :class="classes.legendRow">
				<ui-legend-option color="#fff" label="Actual Stats" />
				<ui-legend-option
					color="rgba(255, 127, 53, 0.12)"
					label="Prediction"
					:hint="{
						border: '1px dashed var(--atom-attention-00, #FF7029)'
					}"
				/>
			</ui-legend-row>
		</ui-legend>
	</div>
</template>

<style module="classes">
.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.chart {
	flex-grow: 1;
	padding: var(--padding-s18, 52px) 20px 0;
}

.legendRow {
	margin-left: auto;
}
</style>
