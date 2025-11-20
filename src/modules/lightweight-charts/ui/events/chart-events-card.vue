<script setup lang="ts">
import { computed } from 'vue';

import type { ICalendarEventMetric } from '@/modules/calendar';

import ChartEventsCardRow from './chart-events-card-row.vue';

interface IProps {
	title: string;
	datetime: string;
	metrics: ICalendarEventMetric[];
}

const props = defineProps<IProps>();

const formattedDate = computed(() => {
	return new Date(Date.parse(props.datetime)).toLocaleString();
});

</script>

<template>
	<div :class="classes.card">
		<p :class="classes.title">
			<span :class="classes.circle"></span>
			<span>{{props.title}}</span>
		</p>
		<p :class="classes.date">{{formattedDate}}</p>
		<div :class="classes.column">
			<chart-events-card-row
				v-for="metric in props.metrics"
				:key="metric.label"
				:name="metric.label"
				:value="metric.value"
			/>
		</div>
	</div>
</template>

<style module="classes">
.circle {
	display: inline-block;
	width: 8px;
	height: 8px;
	margin-right: 5px;
	margin-bottom: 3px;
	background-color: var(--success-success-00, #04eda0);
	border-radius: 999px;
}

.title {
	margin-bottom: 12px;
	font-weight: 500;
	font-size: 16px;
	line-height: 22px;
}

.date {
	font-size: 14px;
	line-height: 21px;
}

.column {
	display: flex;
	flex-direction: column;
	margin-top: 12px;
	font-size: 14px;
}
</style>
