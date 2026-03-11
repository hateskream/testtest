<script setup lang="ts">
import { computed } from 'vue';

import { UiLegend, UiLegendOption, UiLegendRow } from '@/shared/ui/legend';
import { UiScrollableRow } from '@/shared/ui/scrollable-row';
import type { SeasonalsResponse } from '../../model';
import { SeasonalsChart, YearsSelector } from '../common';

interface IViewComponentProps {
	data: SeasonalsResponse;
	availableYears: number[];
}

const props = defineProps<IViewComponentProps>();

const selectedYears = defineModel<number[]>('selectedYears', { required: true });

const fromYear = computed(() => props.availableYears[0] ?? new Date().getFullYear());
const toYear = computed(() => props.availableYears[props.availableYears.length - 1] ?? new Date().getFullYear());
</script>

<template>
	<div :class="classes.container">
		<seasonals-chart
			:class="classes.chart"
			:series="props.data.series"
			:currency="props.data.currency"
			:height="340"
		/>
		<years-selector
			v-model="selectedYears"
			:start="fromYear"
			:end="toYear"
		/>
		<ui-legend :class="classes.legend">
			<ui-scrollable-row>
				<ui-legend-row :class="classes.legendRow">
					<ui-legend-option
						v-for="season in props.data.series"
						:key="season.year"
						:color="season.color"
						:label="season.year.toString()"
					/>
				</ui-legend-row>
			</ui-scrollable-row>
		</ui-legend>
	</div>
</template>

<style module="classes">
.chart {
	position: relative;
	flex: 1;
	min-height: 0;
}

.legend {
	flex-shrink: 0;
}

.legendRow {
	margin-left: auto;
}
</style>
