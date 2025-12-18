<script setup lang="ts">
import SummaryComponent from './summary-component.vue';
import MetricTrendBadge from './metric-trend-badge.vue';

interface ISummary {
	text: string;
	summaryAt: string;
}

interface IMetricTrendBadge {
	trend: 'optimistic' | 'pessimistic' | 'neutral';
}

interface IMainComponentProps {
	metricBadge: IMetricTrendBadge;
	summary: ISummary;
}

const props = defineProps<IMainComponentProps>();

</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<metric-trend-badge
				:trend="props.metricBadge.trend"
			/>
		</div>
		<summary-component
			:summary-at="props.summary.summaryAt"
			:text="props.summary.text"
			:class="classes.summary"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding: 12px 20px 20px;
	gap: 6px;
}

.header {
	display: flex;
	justify-content: space-between;
	padding: 24px 0 6px;
}

.summary {
	flex-grow: 1;
}
</style>
