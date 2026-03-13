<script setup lang="ts">
import { UiScrollableRow } from '@/shared/ui/scrollable-row';
import { UiSegmentedControl, UiSegmentedControlItem } from '@/shared/ui/segmented-control';
import { UiLegend, UiLegendOption, UiLegendRow } from '@/shared/ui/legend';
import { type RevenueHistory, RevenueMode, revenueModeFilters, type RevenueModeType } from '../../model';
import { RevenueBarChart, RevenueLineChart } from '../common';

interface IViewComponentProps {
	data: RevenueHistory;
}

const props = defineProps<IViewComponentProps>();

const activeMode = defineModel<RevenueModeType>({ required: true });
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.chartWrapper">
			<revenue-bar-chart
				v-if="props.data.mode === RevenueMode.Quarterly"
				:years="props.data.years"
				:class="classes.chart"
			/>
			<revenue-line-chart
				v-else-if="props.data.mode === RevenueMode.Yearly"
				:years="props.data.years"
				:class="classes.chart"
			/>
		</div>
		<ui-legend :class="classes.legend">
			<ui-scrollable-row>
				<ui-segmented-control v-model="activeMode">
					<ui-segmented-control-item
						v-for="filter in revenueModeFilters"
						:key="filter.value"
						:value="filter.value"
					>
						{{ filter.label }}
					</ui-segmented-control-item>
				</ui-segmented-control>
				<ui-legend-row>
					<ui-legend-option color="#D9D9D9" label="Reported" />
					<ui-legend-option color="#FF7F35" label="Estimates" />
				</ui-legend-row>
			</ui-scrollable-row>
		</ui-legend>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.chartWrapper {
	flex-grow: 1;
	min-height: 0;
	padding:
		var(--padding-s14, 32px) var(--padding-s11, 20px) 0
		var(--padding-s11, 20px);
}

.chart {
	height: 205px;
}

.legend {
	flex-shrink: 0;
}
</style>
