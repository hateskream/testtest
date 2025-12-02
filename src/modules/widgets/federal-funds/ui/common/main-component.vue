<script setup lang="ts">
interface IMainComponentProps {
	value: number;
}

const props = defineProps<IMainComponentProps>();
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.title">
			<img
				:class="classes.flag"
				src="https://flagcdn.com/us.svg"
				alt="US flag"
			/>
			<span>{{ props.value }}%</span>
		</div>
		<div :class="classes.text">
			Next FOMC review scheduled for Sep 16, 2025.
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 12px 0 20px 20px;
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
</style>
