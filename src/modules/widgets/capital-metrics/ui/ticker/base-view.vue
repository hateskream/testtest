<script setup lang="ts">
import type { CapitalMetrics } from '../../model';
import { MetricsRow, MetricsRowTitleCell, MetricsRowValueCell } from '@/modules/ticker/ui/base';
import { UiText } from '@/shared/ui/text';

interface IBaseViewProps {
	metrics: CapitalMetrics;
}

const props = defineProps<IBaseViewProps>();
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.metrics">
			<metrics-row v-for="metric in props.metrics.metrics" :key="metric.label">
				<metrics-row-title-cell>{{ metric.label }}</metrics-row-title-cell>
				<metrics-row-value-cell :value="metric.value" :unit="metric.unit">
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
</style>
