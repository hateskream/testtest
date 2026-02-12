<script setup lang="ts">
import { computed } from 'vue';

import { UiScrollableRow } from '@/shared/ui/scrollable-row';
import { UiSegmentedControl, UiSegmentedControlItem } from '@/shared/ui/segmented-control';
import { UiLegend, UiLegendOption, UiLegendRow } from '@/shared/ui/legend';
import { getDateRangePresetLabel } from '@/modules/lightweight-charts/model';
import { BaseTickerWidgetHeader } from '@/modules/widgets/base';
import {
	type INominalGdpHistory,
	NOMINAL_GDP_DATE_RANGE_PRESETS,
	type NominalGdpDateRangePresetType,
} from '../../model';

import ChartComponent from '../common/chart-component.vue';
import MetricTrendTag from './metric-trend-tag.vue';

interface IMainComponentProps {
	data: INominalGdpHistory;
	growthYoy: number;
}

const props = defineProps<IMainComponentProps>();

const activeRange = defineModel<NominalGdpDateRangePresetType>('activeRange', { required: true });

const preparedPresets = NOMINAL_GDP_DATE_RANGE_PRESETS.map(preset => ({
	label: getDateRangePresetLabel(preset),
	value: preset,
}));

const metricTagValue = computed(() => Math.abs(props.growthYoy));
const metricTagTrend = computed(() => props.growthYoy > 0 ? 'up' : 'down');
</script>

<template>
	<div :class="classes.container">
		<base-ticker-widget-header v-if="data">
			<template #right>
				<metric-trend-tag :value="metricTagValue" :trend="metricTagTrend"></metric-trend-tag>
			</template>
		</base-ticker-widget-header>
		<div :class="classes.chart">
			<chart-component :points="props.data.points" />
		</div>
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
				<ui-legend-row>
					<ui-legend-option color="#fff" label="GDP" />
					<ui-legend-option color="#FF7F35" label="Potential GDP" />
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

.chart {
	flex-grow: 1;
	padding: var(--padding-s14, 32px) 20px 0;
}
</style>
