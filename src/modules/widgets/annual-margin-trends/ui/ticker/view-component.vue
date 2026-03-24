<script setup lang="ts">
import { computed } from 'vue';

import { UiLegend, UiLegendOption, UiLegendRow } from '@/shared/ui/legend';
import { UiScrollableRow } from '@/shared/ui/scrollable-row';
import type { AnnualMarginTrendsResponse } from '../../model';
import { MarginTrendsChart } from '../common';
import { colorToRgba } from '@/shared/lib/color-to-rgba.ts';

interface IViewComponentProps {
	data: AnnualMarginTrendsResponse;
}

const props = defineProps<IViewComponentProps>();

const legends = computed(() => {
	return props.data.series.map(series => ({
		key: series.key,
		color: series.isDashed ? colorToRgba(series.color, .1) : series.color,
		label: series.label,
		isDashes: series.isDashed,
		hint: series.isDashed ? { border: `1px dashed ${series.color}` } : undefined,
	}));
});
</script>

<template>
	<div :class="classes.container">
		<margin-trends-chart
			:class="classes.chart"
			:series="props.data.series"
			:height="190"
		/>
		<ui-legend :class="classes.legend">
			<ui-scrollable-row>
				<ui-legend-row :class="classes.legendRow">
					<ui-legend-option
						v-for="legend in legends"
						:key="legend.key"
						:color="legend.color"
						:label="legend.label"
						:hint="legend.hint"
					/>
				</ui-legend-row>
			</ui-scrollable-row>
		</ui-legend>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	justify-content: flex-end;
	padding-top: var(--padding-s14, 32px);
}

.chart {
	position: relative;
	min-height: 0;
}

.legend {
	flex-shrink: 0;
}

.legendRow {
	margin-left: auto;
}
</style>
