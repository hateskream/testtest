<script setup lang="ts">
import { computed } from 'vue';
import type { ChartType } from '@shared/component-library';

import {
	type DateRangePresetType,
	type DateRangePresetValue,
	type DateRangeValue,
	DEFAULT_PRESETS,
	getDateRangePresetLabel,
	getDateRangePresetTitle,
	getTimezoneUtcLabel,
	timeZoneUtcFilters,
	type TimezoneUtcType,
} from '@/modules/lightweight-charts/model';
import { UiControlIcon } from '@/shared/ui/control-icon';
import { IconIds } from '@/shared/ui/icon';
import type { IFilterOption } from '@/modules/widgets/base/modal/model';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { ModalBadgeFilter } from '@/modules/widgets/base';
import { UiTooltipBase } from '@/shared/ui/tooltip-base';
import { UiScrollableRow } from '@/shared/ui/scrollable-row';
import type { IndicatorType } from '@/modules/indicator';
import { ChartIndicatorsList } from '@/modules/lightweight-charts';

export interface IChartPriceTickerFiltersProps {
	dateRangePresets?: DateRangePresetValue[];
	availablePoints?: number;
}

const props = withDefaults(defineProps<IChartPriceTickerFiltersProps>(), {
	dateRangePresets: () => DEFAULT_PRESETS,
	availablePoints: 0,
});

const emit = defineEmits<{
	downloadSnapshot: [];
}>();

const dateRange = defineModel<DateRangeValue>('dateRange', { required: true });
const chartType = defineModel<ChartType>('chartType', { required: true });
const timezone = defineModel<TimezoneUtcType>('timezone', { required: true });
const fullView = defineModel<boolean>('fullView', { default: false });
const selectedIndicators = defineModel<IndicatorType[]>('indicators', { default: () => [] });

// date range

const DateRangePresetFilters = computed(() => {
	return props.dateRangePresets.map(preset => ({
		label: getDateRangePresetTitle(preset.preset),
		value: preset.preset,
	})) satisfies IFilterOption<string>[];
});

function selectDateRange(preset: DateRangePresetType) {
	dateRange.value = props.dateRangePresets.find(it => it.preset === preset)!;
}

const selectedDateRangePreset = computed(() => {
	if (!dateRange.value) {
		return undefined;
	}

	if (dateRange.value.type === 'preset') {
		return dateRange.value.preset;
	}

	return undefined;
});

const dateRangeTitle = computed(() => {
	const range = dateRange.value;

	if (!range) {
		return 'Range';
	}

	if (range.type === 'preset') {
		return `${getDateRangePresetLabel(range.preset)} range`;
	}

	return 'Custom range';
});

// chart type

const ChartTypeFilters = [
	{ label: 'Candlestick', value: 'candlestick' },
	{ label: 'Line', value: 'area' },
] as const satisfies IFilterOption<string>[];

const chartTypeTitle = computed(() => {
	if (chartType.value === 'candlestick') {
		return 'Candlestick';
	}

	return 'Line';
});

const timezoneLabel = computed(() => getTimezoneUtcLabel(timezone.value));

function downloadSnapshot() {
	emit('downloadSnapshot');
}
</script>

<template>
	<ui-scrollable-row>
		<div :class="classes.container">
			<div :class="classes.filters">
				<modal-badge-filter
					v-if="dateRangePresets.length && dateRange"
					display-variant="new"
					:options="DateRangePresetFilters"
					:selected-value="selectedDateRangePreset"
					:label="dateRangeTitle"
					close-on-select
					title="Range"
					@select="selectDateRange($event.value)"
				/>
				<modal-badge-filter
					display-variant="new"
					:options="timeZoneUtcFilters"
					:selected-value="timezone"
					:label="timezoneLabel"
					close-on-select
					title="Time zone"
					@select="timezone = $event.value"
				/>
				<ui-delimiter :class="classes.delimiter" />
				<modal-badge-filter
					display-variant="new"
					:options="ChartTypeFilters"
					:selected-value="chartType"
					:label="chartTypeTitle"
					close-on-select
					title="Type"
					:icon="IconIds.ChartView"
					@select="chartType = $event.value"
				/>
				<chart-indicators-list v-model="selectedIndicators" :available-points="availablePoints" />
			</div>
			<div :class="classes.actions">
				<div :class="classes.instruments">
					<ui-tooltip-base
						label="Download a snapshot"
						text="Capture the current chart view with all filters and indicators applied"
					>
						<template #trigger>
							<ui-control-icon
								:icon="IconIds.Camera"
								transparent
								@click="downloadSnapshot"
							/>
						</template>
					</ui-tooltip-base>
					<ui-tooltip-base
						label="Fullscreen mode"
						text="View the chart in fullscreen for better focus and clarity"
					>
						<template #trigger>
							<ui-control-icon
								:icon="fullView ? IconIds.ControlMinimize : IconIds.ControlFullView"
								transparent
								:icon-size="14"
								@click="fullView = !fullView"
							/>
						</template>
					</ui-tooltip-base>
				</div>
				<ui-control-icon :icon="IconIds.ControlMore" transparent />
			</div>
		</div>
	</ui-scrollable-row>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	gap: var(--padding-s7, 12px);
}

.delimiter {
	margin: 0 4px;
}

.filters {
	display: flex;
	align-items: center;
	gap: 4px;
}

.actions {
	display: flex;
	align-items: center;
	gap: var(--padding-s6, 10px);
}

.instruments {
	display: flex;
	align-items: center;
	gap: var(--padding-s2, 2px);
}
</style>
