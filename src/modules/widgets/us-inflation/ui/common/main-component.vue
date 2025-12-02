<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

import ChartComponent from './chart-component.vue';

interface IMainComponentProps {
	value: number;
	second: number;
	trend: 'up' | 'down';
}

const props = defineProps<IMainComponentProps>();
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.textContainer">
			<div :class="classes.title">
				<img
					:class="classes.flag"
					src="https://flagcdn.com/us.svg"
					alt="US flag"
				/>
				<span>{{ props.value }}%</span>
			</div>
			<div :class="classes.text">
				Inflation down YoY:
			</div>
			<div :class="[classes.text, classes.trend]">
				{{ props.second }} pp
				<ui-icon
					:id="props.trend === 'up' ? IconIds.Gainers : IconIds.Loosers"
					height="6px"
					width="6px"
					:class="classes.icon"
				/>
			</div>
		</div>
		<div :class="classes.chart">
			<chart-component />
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	gap: 12px;
	padding: 12px 0 20px 20px;
}

.textContainer {
	display: flex;
	flex-direction: column;
}

.title {
	display: flex;
	align-items: center;
	font-style: normal;
	font-weight: 440;
	font-size: 16.8px;
	line-height: 160%; /* 26.88px */
	color: rgb(255 255 255 / 96%);
	letter-spacing: 0.134px;
	gap: 6px;
}

.flag {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	object-fit: cover;
	object-position: 25%;
}

.text {
	font-style: normal;
	font-weight: 400;
	font-size: 12.2px;
	line-height: 180%; /* 21.96px */
	color: rgb(255 255 255 / 62%);
	letter-spacing: 0.122px;
}

.trend {
	display: inline-flex;
	align-items: center;
	gap: var(--padding-padding-s4, 6px);
}

.chart {
	flex-grow: 1;
	height: 100%;
}
</style>
