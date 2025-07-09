<script setup lang="ts">

import type { ICurrency } from '../model';

import ChartComponent from '@/modules/lightweight-charts/ui/chart-component.vue';


</script>

<template>
	<div :class="classes.root">
		<chart-component :height="400" />
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	padding: 4px 8px;
	font-size: 16px;
	letter-spacing: 0.104px;
	cursor: pointer;
	gap: 4px;

	&:hover {
		.hoverActions {
			display: flex;
		}
	}
}

.hoverActions {
	position: absolute;
	top: 50%;
	right: 4px;
	display: none;
	justify-content: center;
	align-items: center;
	width: 15%;
	max-width: 56px;
	height: 100%;
	padding: 0 6px 0 12px;
	background: linear-gradient(90deg, rgb(255 255 255 / 0%) 0%, var(--bg-color-surface-01) 40%);
	transform: translateY(-50%);
	cursor: default;
}

.hoverActionIcon {
	color: var(--icon-color-base-300);
}

.root:hover .icon {
	color: var(--icon-color-base-300);
}

.root:hover .content {
	background-color: var(--bg-color-surface-02);
}

.icon {
	color: transparent;
	cursor: grab;
}

.icon:active {
	cursor: grabbing;
}

.content {
	display: flex;
	flex-grow: 1;
	align-items: center;
	padding: 4px;
	border-radius: 16px;
}

.logo {
	margin-right: 12px;
}

.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	gap: 4px;
}

.ticker {
	display: inline-flex;
	font-weight: 300;
	line-height: 150%;
	color: var(--text-color-base-100);
	gap: 2px;
}

.containerSecond {
	display: flex;
	gap: 4px;
	line-height: 125%;
}

.marketCap {
	font-weight: 440;
	color: var(--text-color-base-500);
}

.change {
	font-weight: 440;
	color: rgb(178 242 211 / 100%);
}

.chart {
	margin-left: 42px;
}
</style>
