<script setup lang="ts">
import { TreemapComponent, useDisplaySettings } from '@/modules/treemap';
import { AppLayout } from '@/modules/layout';

const {
	marketSettings,
	sizeBySettings,
	colorBySettings,
	colorDepthSettings,
	displayValueSettings,
	activeColorBy,
	activeSizeBy,
	activeColorDepth,
	activeDisplayValue,
	isShowLogo,
	titleSetting,
	activeMarket,
	activeGroupBy,
	groupBySettings,
} = useDisplaySettings();
</script>

<template>
	<app-layout>
		<div :class="classes.container">
			<h2 :class="classes.header">Heatmap</h2>
			<treemap-component
				v-model:market="marketSettings"
				v-model:size-by="sizeBySettings"
				v-model:color-by="colorBySettings"
				v-model:color-depth="colorDepthSettings"
				v-model:display-value="displayValueSettings"
				v-model:group-by="groupBySettings"
				v-model:is-show-logo="isShowLogo"
				v-model:title="titleSetting"
				display-variant="new"
				:active-market="activeMarket"
				:active-color-by="activeColorBy"
				:active-color-depth="activeColorDepth"
				:active-size-by="activeSizeBy"
				:active-display-value="activeDisplayValue"
				:active-group-by="activeGroupBy"
			/>
		</div>
	</app-layout>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding: 20px;
}

.header {
	margin: 16px 0;
	font-style: normal;
	font-weight: 340;
	font-size: 36px;
	line-height: 100%;
	color: var(--text-color-base-500);
}
</style>
