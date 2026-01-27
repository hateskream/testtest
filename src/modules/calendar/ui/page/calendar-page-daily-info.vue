<script setup lang="ts">
import { computed } from 'vue';

import { UiText } from '@/shared/ui/text';
import { getDateFormatter } from '@/shared/lib/date-formatter';
import type { IDailyInfoItem, IDailyInfoResponse } from '../../model/calendar';

const METRIC_CONFIG = [
	{ key: 'economic', label: 'Economic' },
	{ key: 'earnings', label: 'Earnings' },
	{ key: 'dividends', label: 'Dividends' },
	{ key: 'ipo', label: 'IPO' },
	{ key: 'splits', label: 'Splits' },
	{ key: 'crypto_events', label: 'Crypto' },
	{ key: 'news', label: 'News' },
] as const;

const props = defineProps<{
	weeks: IDailyInfoResponse;
	selectedDate?: string;
}>();

const emits = defineEmits<{
	'select-day': [date: string];
}>();

const weekdayFormatter = getDateFormatter({ weekday: 'short', timeZone: 'UTC' });
const dayFormatter = getDateFormatter({ day: 'numeric', timeZone: 'UTC' });

function mapDay(item: IDailyInfoItem, todayStr: string) {
	const date = new Date(`${item.date}T00:00:00Z`);

	const metrics = METRIC_CONFIG
		.map((cfg) => ({
			label: cfg.label,
			value: item.metrics[cfg.key],
		}));

	return {
		date: item.date,
		weekdayShort: weekdayFormatter.format(date),
		dayNumber: dayFormatter.format(date),
		isToday: item.date === todayStr,
		metrics,
		colorDots: [],
	};
}

const weekDays = computed(() => {
	const today = new Date();
	today.setUTCHours(0, 0, 0, 0);
	const todayStr = today.toISOString().slice(0, 10);

	return props.weeks.map((item) => mapDay(item, todayStr));
});

function isSelected(date: string) {
	return props.selectedDate === date;
}
</script>

<template>
	<div :class="classes.calendarScrollWrapper">
		<div :class="classes.calendarWeeklyInfo">
			<div
				v-for="dayItem in weekDays"
				:key="dayItem.dayNumber + '-' + dayItem.weekdayShort"
				:class="[
					classes.dayCard,
					dayItem.isToday ? classes.today : '',
					isSelected(dayItem.date) ? classes.selected : '',
				]"
				@click="emits('select-day', dayItem.date)"
			>
				<div :class="classes.dayTitle">
					{{ dayItem.weekdayShort }} {{ dayItem.dayNumber }}
				</div>

				<div :class="classes.dayMetrics">
					<template
						v-for="metric in dayItem.metrics"
						:key="metric.label"
					>
						<div
							v-if="metric.value !== undefined"
							:class="classes.metric"
						>
							<ui-text
								token="text-300-r"
								as="div"
								:class="classes.metricLabel"
							>
								{{ metric.label }}:
							</ui-text>
							<ui-text
								token="text-300-r"
								as="div"
								:class="classes.metricValue"
							>
								{{ metric.value }}
							</ui-text>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.calendarScrollWrapper {
	width: 100%;
	overflow-x: auto;
}

.calendarWeeklyInfo {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-self: stretch;
	gap: 8px;
}

.dayCard {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	padding: 12px;
	border: 1px solid var(--color-border-base-300, rgb(97 97 97 / 30%));
	border-radius: 18px;
	cursor: pointer;
	transition-timing-function: ease;
	transition-duration: 0.25s;
	transition-property: border, background-color;
	gap: 24px;
}

.dayCard:not(.today):hover {
	background: var(--color-bg-hover-surface-01-hover, rgb(37 35 35 / 30%));
	border: 1px solid var(--color-border-hover-base-300-hover, rgb(166 166 166 / 30%));
}

.dayCard.selected:hover {
	border: 1px solid var(--color-border-base-300, rgb(97 97 97));
}

.today {
	background: var(--color-bg-surface-02, #161618);
}

.selected {
	border: 1px solid var(--color-border-base-300, rgb(97 97 97));
}

.dayTitle {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-weight: 410;
	font-size: var(--font-title-300-size, 20px);
	color: var(--color-text-base-500, #ffffff);
}

.colorDot {
	width: 8px;
	height: 8px;
	border-radius: 999px;
}

.dayMetrics {
	display: flex;
	flex-direction: column;
	align-self: stretch;
	gap: 1px;
}

.metric {
	display: inline-flex;
	justify-content: space-between;
	gap: 4px;
	letter-spacing: 0.143px;
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
}

.metricLabel {
	color: var(--color-text-base-100, #646568);
}

.metricValue {
	color: var(--color-text-base-500, #ffffff);
}
</style>
