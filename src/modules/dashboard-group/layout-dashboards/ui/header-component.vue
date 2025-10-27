<script setup lang="ts">
import { ref } from 'vue';

const tabs = ['Main', 'Crypto', 'Stock'];
const active = ref('Main');
</script>

<template>
	<div :class="classes.navbar">
		<div :class="classes.title">Dashboard</div>
		<div :class="classes.tabs">
			<button
				v-for="tab in tabs"
				:key="tab"
				:class="[classes.tab, active === tab && classes.active]"
				@click="active = tab"
			>
				{{ tab }}
			</button>
		</div>
	</div>
</template>

<style module="classes">
.navbar {
	display: flex;
	align-items: center;
	height: 44px;
	padding: 0 10px 0 16px;
	color: #ffffff;
	border-bottom: 1px solid #1d1d1e;
	gap: 16px;
}

.title {
	font-style: normal;
	font-weight: 520;
	font-size: 12px;
	line-height: 20px;
	letter-spacing: 0.1px;
}

.tabs {
	display: flex;
	align-items: center;
	font-style: normal;
	font-weight: 450;
	font-size: 12px;
	line-height: 20px;
	letter-spacing: 0.059px;
	gap: 4px;
}

.tab {
	height: 24px;
	padding: 0 10px;
	color: #9b9b9b;
	background: transparent;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.2s, color 0.2s;
}

.tab:hover {
	color: #ffffff;
}

.active {
	color: #ffffff;
	background: rgb(73 73 80 / 70%);
}
</style>
