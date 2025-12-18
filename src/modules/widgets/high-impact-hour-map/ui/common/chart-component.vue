<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

const hoursMap = [
	{
		hours: 0,
		percent: '0',
	},
	{
		hours: 1,
		percent: '0',
	},
	{
		hours: 3,
		percent: '0',
	},
	{
		hours: 4,
		percent: '0',
	},
	{
		hours: 6,
		percent: '1-20',
	},
	{
		hours: 7,
		percent: '0',
	},
	{
		hours: 9,
		percent: '0',
	},
	{
		hours: 11,
		percent: '20-40',
	},
	{
		hours: 12,
		percent: '0',
	},
	{
		hours: 13,
		percent: '0',
	},
	{
		hours: 14,
		percent: '0',
	},
	{
		hours: 16,
		percent: '20-40',
	},
	{
		hours: 18,
		percent: '60-80',
	},
	{
		hours: 20,
		percent: '80-100',
	},
	{
		hours: 22,
		percent: '0',
	},
	{
		hours: 24,
		percent: '0',
	},
];

const colorMap: Record<string, string> = {
	'0': '#181819',
	'1-20': '#353536',
	'20-40': '#5E5E5F',
	'40-60': '#878787',
	'60-80': '#B0B0B0',
	'80-100': '#D9D9D9',
};
</script>

<template>
	<div>
		<div :class="classes.header">
			<ui-text :class="classes.label" token="text-100-r">next event:</ui-text>
			<div :class="classes.titleContainer">
				<div :class="classes.title">
					<img
						:class="classes.flag"
						src="https://flagcdn.com/us.svg"
						alt="US flag"
					/>
					<ui-text token="text-300-r">US Federal Funds Rate</ui-text>
				</div>
				<ui-text :class="classes.time" token="text-300-r">in 2 hours</ui-text>
			</div>
		</div>
		<div :class="classes.timeline">
			<div
				v-for="el in hoursMap"
				:key="el.hours"
				:class="classes.bar"
				:style="{ backgroundColor: colorMap[el.percent] }"
			></div>
		</div>
		<div :class="classes.hours">
			<ui-text
				v-for="el in hoursMap"
				:key="el.hours"
				token="text-100-r"
				align="center"
			>
				{{ el.hours < 10 ? '0' + el.hours : el.hours }}
			</ui-text>
		</div>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	flex-direction: column;
	gap: 4px;
	margin-bottom: 12px;
}

.titleContainer {
	display: flex;
	justify-content: space-between;
}

.label {
	color: rgb(255 255 255 / 62%);
}

.title {
	display: flex;
	align-items: center;
	color: rgb(255 255 255 / 96%);
	gap: 6px;
}

.flag {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	object-fit: cover;
	object-position: 25%;
}

.time {
	color: rgb(255 255 255 / 96%);
	text-decoration-line: underline;
	text-decoration-style: dotted;
	text-decoration-skip-ink: auto;
	text-decoration-thickness: auto;
	text-underline-offset: auto;
	text-underline-position: from-font;
	cursor: pointer;
}

.timeline {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-top: 4px;
	gap: 6px;
}

.bar {
	width: 16px;
	height: 40px;
	background: #1c1c1c;
	border-radius: 4px;
}

.hours {
	display: flex;
	justify-content: space-between;
	color: rgb(255 255 255 / 30%);
}
</style>
