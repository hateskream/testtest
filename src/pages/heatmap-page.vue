<script setup lang="ts">
import { TreemapComponent, useDisplaySettings } from '@/modules/treemap';
import { LayoutComponent } from '@/modules/layout';

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
	<layout-component :is-curtain-fixed="false">
		<template #header>
			<div :class="classes.header">Heatmap</div>
		</template>
		<template #content>

			<treemap-component
				v-model:market="marketSettings"
				v-model:size-by="sizeBySettings"
				v-model:color-by="colorBySettings"
				v-model:color-depth="colorDepthSettings"
				v-model:display-value="displayValueSettings"
				v-model:group-by="groupBySettings"
				v-model:is-show-logo="isShowLogo"
				v-model:title="titleSetting"
				:active-market="activeMarket"
				:active-color-by="activeColorBy"
				:active-color-depth="activeColorDepth"
				:active-size-by="activeSizeBy"
				:active-display-value="activeDisplayValue"
				:active-group-by="activeGroupBy"
			/>
		</template>
	</layout-component>
</template>

<style module="classes">
.header {
	font-style: normal;
	font-weight: 340;
	font-size: 36px;
	line-height: 100%;
	color: var(--text-color-base-500);
}
</style>
