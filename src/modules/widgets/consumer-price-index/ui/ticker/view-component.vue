<script setup lang="ts">
import { getDateRangePresetLabel } from '@/modules/lightweight-charts/model';
import { UiSegmentedControl, UiSegmentedControlItem } from '@/shared/ui/segmented-control';
import { UiScrollableRow } from '@/shared/ui/scrollable-row';
import { UiLegend } from '@/shared/ui/legend';
import { ChartComponent, FiltersPanel } from '../common';
import type { CpiDateRangePresetType, CpiHistory, CpiValueTypeType } from '../../model';
import { CPI_DATE_RANGE_PRESETS } from '../../model';

interface IViewComponentProps {
	history: CpiHistory;
}

const props = defineProps<IViewComponentProps>();

const emit = defineEmits<{
	reset: [];
}>();

const activeRange = defineModel<CpiDateRangePresetType>('dateRange', { required: true });
const valueType = defineModel<CpiValueTypeType>('valueType', { required: true });

const preparedPresets = CPI_DATE_RANGE_PRESETS.map(preset => ({
	label: getDateRangePresetLabel(preset.preset),
	value: preset.preset,
}));
</script>

<template>
	<div :class="classes.container">
		<filters-panel
			v-model:value-type="valueType"
			display-variant="new"
			:class="classes.filters"
			@reset="emit('reset')"
		/>
		<chart-component
			:class="classes.chart"
			:points="props.history.points"
			:value-type="valueType"
		/>
		<ui-legend :class="classes.legend">
			<ui-scrollable-row>
				<ui-segmented-control v-model="activeRange" :class="classes.legendRange">
					<ui-segmented-control-item
						v-for="preset in preparedPresets"
						:key="preset.value"
						:value="preset.value"
					>
						{{ preset.label }}
					</ui-segmented-control-item>
				</ui-segmented-control>
			</ui-scrollable-row>
		</ui-legend>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.filters {
	flex-shrink: 0;
	padding: 8px 20px;
}

.chart {
	flex-grow: 1;
	padding: 0 20px;
}

.legend {
	flex-shrink: 0;
	gap: 20px;
}

.legendRange {
	width: min-content;
	padding: 0;
}
</style>
