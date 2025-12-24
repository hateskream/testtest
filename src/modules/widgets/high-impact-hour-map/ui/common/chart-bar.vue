<script setup lang="ts">
import { computed } from 'vue';

import { UiText } from '@/shared/ui/text';
import { DashboardTooltipWrapper } from '@/shared/ui/tooltip';
import { UiPositionTooltip } from '@/shared/ui/position';
import { pluralizeTemplate } from '@/shared/lib';

import ChartBarHourLabel from './chart-bar-hour-label.vue';

interface IChartBarProps {
	impactLevel: number;
	hours: number[];
	active?: boolean;
	eventsCount: number;
}

const props = defineProps<IChartBarProps>();

const colorMap: Record<number, string> = {
	0: '#181819',
	1: '#353536',
	2: '#5E5E5F',
	3: '#878787',
	4: '#B0B0B0',
	5: '#D9D9D9',
} as const;

const color = computed(() => colorMap[Math.ceil(props.impactLevel * 5)]);

const hourLabel = computed(() => {
	const [hour] = props.hours;

	const formatterHour = hour < 10 ? `0${hour}` : hour;

	if (props.hours.length > 1) {
		return `${formatterHour}..`;
	}

	return formatterHour;
});

const fullHourLabel = computed(() => {
	if (props.hours.length === 1) {
		const [hour] = props.hours;
		return hour < 10 ? `0${hour}` : hour.toString();
	}

	const rangeHours = [props.hours[0], props.hours[props.hours.length - 1] + 1];

	return rangeHours.map(hour => hour < 10 ? `0${hour}:00` : `${hour}:00`).join(' - ');
});

const eventsCountLabel = computed(() => {
	if (props.eventsCount === 0) {
		return 'No events in this segment';
	}

	return pluralizeTemplate(props.eventsCount, '%d event in segment', '%d events in segment');
});
</script>

<template>
	<div :class="classes.barContainer">
		<ui-position-tooltip
			placement="top"
			:open-delay="50"
			:class="classes.bar"
			:style="{ backgroundColor: color }"
		>
			<div :class="classes.barInner"></div>
			<template #content>
				<dashboard-tooltip-wrapper>
					{{ eventsCountLabel }}
				</dashboard-tooltip-wrapper>
			</template>
		</ui-position-tooltip>
		<chart-bar-hour-label :show-tooltip="props.hours.length > 1" :tooltip-content="fullHourLabel">
			<ui-text
				token="text-100-r"
				align="center"
				:class="[classes.hour, { [classes.active]: props.active }]"
			>
				{{ hourLabel }}
			</ui-text>
		</chart-bar-hour-label>
	</div>
</template>

<style module="classes">
.barContainer {
	display: flex;
	flex-direction: column;
	cursor: pointer;
}

.bar {
	display: flex;
	flex-grow: 1;
	min-width: 14px;
	border-radius: 4px;
	outline: 1px solid transparent;
	transition: outline-color 0.2s ease-in-out;
}

.bar > div[data-position-trigger] {
	display: flex;
	flex-grow: 1;
}

.barInner {
	flex-grow: 1;
}

.hour {
	position: relative;
	color: var(--text-100, rgb(255 255 255 / 30%));
	transition: color 0.2s ease-in-out;
}

.hour::after {
	content: '';
	position: absolute;
	bottom: -2px;
	left: 0;
	display: block;
	width: 100%;
	height: 2px;
	padding-bottom: 2px;
	background-color: var(--text-500, rgb(255 255 255 / 96%));
	opacity: 0;
	transition: opacity 0.2s ease-in-out;
}

.hour.active::after,
.barContainer:hover .hour::after {
	opacity: 1;
}

.hour.active {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.barContainer:hover .bar {
	outline-color: var(--text-500, rgb(255 255 255 / 10%));
}

.barContainer:hover .hour {
	color: var(--text-500, rgb(255 255 255 / 96%));
}
</style>
