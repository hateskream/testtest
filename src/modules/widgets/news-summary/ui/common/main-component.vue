<script setup lang="ts">
import type { NewsSummarySentiment } from '../../model';

import SummaryComponent from './summary-component.vue';
import MetricTrendBadge from './metric-trend-badge.vue';

interface IMainComponentProps {
	sentiment: NewsSummarySentiment;
	summary: string;
	summarizedAt: Date;
}

const props = defineProps<IMainComponentProps>();
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.header">
			<metric-trend-badge :trend="props.sentiment" />
		</div>
		<summary-component
			:summarized-at="props.summarizedAt"
			:text="props.summary"
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
