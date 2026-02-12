<script setup lang="ts">
import { computed } from 'vue';

import { UiScrollableRow } from '@/shared/ui/scrollable-row';
import { UiSegmentedControl, UiSegmentedControlItem } from '@/shared/ui/segmented-control';
import { UiLegend } from '@/shared/ui/legend';
import { getDateRangePresetLabel } from '@/modules/lightweight-charts/model';
import { BaseTickerWidgetHeader } from '@/modules/widgets/base';
import {
	type IRealGdpHistory,
	REAL_GDP_DATE_RANGE_PRESETS,
	type RealGdpDateRangePresetType,
	type RealGdpValueTypeType,
} from '../../model';

import ChartComponent from '../common/chart-component.vue';
import MetricTrendTag from './metric-trend-tag.vue';
import FiltersPanel from './filters-panel.vue';

interface IMainComponentProps {
	data: IRealGdpHistory;
	growthYoy: number;
}

const props = defineProps<IMainComponentProps>();

const activeRange = defineModel<RealGdpDateRangePresetType>('activeRange', { required: true });
const valueType = defineModel<RealGdpValueTypeType>('valueType', { required: true });

const preparedPresets = REAL_GDP_DATE_RANGE_PRESETS.map(preset => ({
	label: getDateRangePresetLabel(preset),
	value: preset,
}));

const metricTagValue = computed(() => Math.abs(props.growthYoy));
const metricTagTrend = computed(() => props.growthYoy > 0 ? 'up' : 'down');
</script>

<template>
	<div :class="classes.container">
		<base-ticker-widget-header v-if="data">
			<template #label>
				<filters-panel v-model:value-type="valueType" :class="classes.filters" />
			</template>
			<template #right>
				<metric-trend-tag
					:value="metricTagValue"
					:trend="metricTagTrend"
					is-percent
					:class="classes.trend"
				/>
			</template>
		</base-ticker-widget-header>
		<div :class="classes.chart">
			<chart-component :points="props.data.points" :value-type="valueType" />
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

.filters {
	flex-grow: 1;
}

.trend {
	flex-shrink: 0;
}

.chart {
	flex-grow: 1;
	padding: var(--padding-s14, 32px) 20px 0;
}
</style>
