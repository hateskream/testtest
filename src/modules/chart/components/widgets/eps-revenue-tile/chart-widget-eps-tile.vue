<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';

export interface IChartWidgetEpsTileProps {
	quarter: string;
	actualEps?: number;
	estimatedEps?: number;
	revenue: string;
	percentage: string;
	status: 'success' | 'fail' | 'future';
	beat?: boolean;
	event?: {
		date: string;
		time: string;
	};
}

interface IProps {
	data: IChartWidgetEpsTileProps;
}

defineProps<IProps>();
</script>

<template>
	<chart-common-widget-layout>
		<template #body>
			<div :class="classes.container">
				<div :class="classes.header" class="text-200-r">
					{{ data.quarter }}
				</div>


				<div :class="classes.metrics">
					<div :class="classes.metric">
						<div :class="classes.metricLabel">
							{{ data.actualEps ? 'Actual EPS' : 'Est. EPS' }}
						</div>
						<div :class="[classes.metricValue, classes[data.status]]">
							{{ data.actualEps || data.estimatedEps }}
						</div>
					</div>

					<div :class="classes.metric">
						<div :class="classes.metricLabel">Revenue</div>
						<div :class="[classes.metricValue, classes[data.status]]">
							{{ data.revenue }}
						</div>
					</div>
				</div>

				<div :class="classes.performance">
					<div :class="[classes.percentage, classes[data.status]]">
						{{ data.percentage }}
					</div>

					<div v-if="data.beat" :class="classes.beatBadge">
						Beat
					</div>

					<div v-if="data.event" :class="classes.event">
						<div :class="classes.eventDate">{{ data.event.date }}</div>
						<div :class="classes.addToCalendar">
							<span>+</span> Add to Calendar
						</div>
					</div>
				</div>
			</div>
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 282px;
	padding: 16px;
	gap: 16px;
}

.header {
	text-align: center;
	color: var(--text-color-base-500);
}


.metrics {
	display: flex;
	justify-content: space-between;
	gap: 16px;
}

.metric {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.metricLabel {
	font-weight: 400;
	font-size: 11px;
	color: #888888;
	text-transform: uppercase;
}

.metricValue {
	font-weight: 600;
	font-size: 16px;
}

.metricValue.success {
	color: #04eda0;
}

.metricValue.fail {
	color: #ff4757;
}

.metricValue.future {
	color: #888888;
}

.performance {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
}

.percentage {
	font-weight: 600;
	font-size: 20px;
}

.percentage.success {
	color: #04eda0;
}

.percentage.fail {
	color: #ff4757;
}

.percentage.future {
	color: #888888;
}

.beatBadge {
	padding: 4px 12px;
	font-weight: 600;
	font-size: 10px;
	color: #000000;
	text-transform: uppercase;
	background-color: #04eda0;
	border-radius: 4px;
}

.event {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	text-align: center;
}

.eventDate {
	font-weight: 500;
	font-size: 14px;
	color: #ffffff;
}

.addToCalendar {
	font-size: 11px;
	color: #888888;
	cursor: pointer;
	transition: color 0.2s;
}

.addToCalendar:hover {
	color: #04eda0;
}
</style>
