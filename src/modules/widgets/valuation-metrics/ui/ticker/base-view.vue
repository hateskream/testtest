<script setup lang="ts">
import type { ValuationMetrics } from '../../model';
import { MetricsRow, MetricsRowHeader, MetricsRowTitleCell, MetricsRowValueCell } from '@/modules/ticker/ui/base';
import { UiText } from '@/shared/ui/text';

interface IBaseViewProps {
	metrics: ValuationMetrics;
}

const props = defineProps<IBaseViewProps>();
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.metrics">
			<metrics-row :class="classes.header">
				<metrics-row-header>LTM</metrics-row-header>
				<metrics-row-header>NTM</metrics-row-header>
			</metrics-row>
			<metrics-row v-for="metric in props.metrics.metrics" :key="metric.label">
				<metrics-row-title-cell>{{ metric.label }}</metrics-row-title-cell>
				<metrics-row-value-cell :value="metric.ltm" :unit="metric.unit">
					<template v-if="metric.description" #tooltip>
						<ui-text token="text-200-r">
							{{ metric.description }}
						</ui-text>
					</template>
				</metrics-row-value-cell>
				<metrics-row-value-cell :value="metric.ntm" :unit="metric.unit">
					<template v-if="metric.description" #tooltip>
						<ui-text token="text-200-r">
							{{ metric.description }}
						</ui-text>
					</template>
				</metrics-row-value-cell>
			</metrics-row>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	width: 100%;
	overflow-x: auto;
}

.metrics {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.header {
	justify-content: flex-end;
}
</style>
