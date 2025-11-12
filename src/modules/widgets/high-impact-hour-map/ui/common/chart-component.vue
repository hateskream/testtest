<script setup lang="ts">
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
	<div :class="classes.container">
		<div :class="classes.header">
			<span :class="classes.label">next event:</span>
			<div :class="classes.titleContainer">
				<div :class="classes.title">
					<img
						:class="classes.flag"
						src="https://flagcdn.com/us.svg"
						alt="US flag"
					/>
					<span>US Federal Funds Rate</span>
				</div>
				<span :class="classes.time">in 2 hours</span>
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
			<span v-for="el in hoursMap" :key="el.hours">{{ el.hours < 10 ? '0' + el.hours : el.hours }}</span>
		</div>
	</div>
</template>

<style module="classes">
.container {
	/* font-family: system-ui, sans-serif;
	color: #eaeaea; */
}

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
	font-style: normal;
	font-weight: 400;
	font-size: 11px;
	line-height: 180%; /* 19.8px */
	color: rgb(255 255 255 / 62%);
	letter-spacing: 0.088px;
}

.title {
	display: flex;
	align-items: center;
	font-style: normal;
	font-weight: 400;
	font-size: 13.3px;
	line-height: 180%; /* 23.94px */
	color: rgb(255 255 255 / 96%);
	letter-spacing: 0.146px;
	gap: 6px;
}

.flag {
	width: 20px;
	height: 14px;
	border-radius: 2px;
}

.time {
	font-style: normal;
	font-weight: 400;
	font-size: 13.3px;
	line-height: 180%; /* 23.94px */
	color: rgb(255 255 255 / 96%);
	letter-spacing: 0.146px;
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
	font-style: normal;
	font-weight: 400;
	font-size: 11px;
	line-height: 180%; /* 19.8px */
	text-align: center;
	color: rgb(255 255 255 / 30%);
	letter-spacing: 0.088px;
}
</style>
