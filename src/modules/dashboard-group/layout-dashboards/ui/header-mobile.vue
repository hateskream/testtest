<script setup lang="ts">
import { ref } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

const tabs = ['Main', 'Crypto', 'Stock', 'Forex', 'dsdfsdfsdfsd', 'sddscsdcsdcd', 'sdcdscdscd'];
const active = ref('Main');
</script>

<template>
	<div :class="classes.navbar">
		<div :class="classes.line" />
		<div :class="classes.content">
			<div :class="classes.title">Dashboard</div>
			<div :class="classes.divider" />
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
			<div :class="classes.close">
				<ui-icon
					:id="IconIds.ControlPlus"
					:width="20"
					:height="20"
					:class="classes.closeIcon"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.navbar {
	display: flex;
	flex-direction: column;
}

.line {
	position: relative;
	width: 100%;
	height: 1px;
	overflow: hidden;
	background: rgb(255 255 255 / 8%);
}

.line::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background:
		linear-gradient(
			to right,
			rgb(255 255 255 / 0%) 0%,
			rgb(255 255 255 / 8%) 50%,
			rgb(255 255 255 / 0%) 100%
		);
}

.content {
	display: flex;
	align-items: center;
	height: 52px;
	padding: 0 12px;
	color: #ffffff;
	border-bottom: 1px solid rgb(255 255 255 / 8%);
}

.divider {
	width: 1px;
	height: 16px;
	margin-right: 8px;
	margin-left: 16px;
	background: rgb(255 255 255 / 18%);
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
	flex-grow: 1;
	align-items: center;
	overflow: auto;
	font-style: normal;
	font-weight: 450;
	font-size: 12px;
	line-height: 20px;
	letter-spacing: 0.059px;
	gap: 4px;
	scrollbar-width: none;
}

.tab {
	height: 24px;
	padding: 0 14px;
	color: #9b9b9b;
	cursor: pointer;
	transition: color 0.2s;
}

.tab:hover {
	color: #ffffff;
}

.active {
	color: #ffffff;
}

.close {
	padding-left: 20px;
}

.closeIcon {
	transform: rotate(45deg) scale(1.5);
}
</style>
