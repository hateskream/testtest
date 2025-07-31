<script setup lang="ts">
import { ref, watch } from 'vue';

import { useQueryDisplaySettings, useQueryHeatmap } from '../query';
import { useDisplaySettings, useHeatmap } from '../composables/';
import { UiTreemap } from '@/shared/ui/treemap';
import { TitleViewVariant } from '../model';

import SettingsComponent from './settings-component.vue';

const { data: settings } = useQueryDisplaySettings();

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
} = useDisplaySettings(settings);

const excludeTickers = ref<string[]>([]);

const { data: heatmapData, refetch } = useQueryHeatmap(marketSettings.active, excludeTickers);

const {
	heatmap,
	isSizeValuePercent,
	isDisplayValuePercent,
} = useHeatmap(
	heatmapData,
	activeSizeBy,
	activeColorBy,
	activeDisplayValue,
	titleSetting,
);

watch(() => marketSettings.active, () => {
	refetch();
});
</script>

<template>
	<div :class="classes.root">
		<settings-component
			v-model:is-show-logo="isShowLogo"
			v-model:market="marketSettings"
			v-model:size-by="sizeBySettings"
			v-model:color-by="colorBySettings"
			v-model:color-depth="colorDepthSettings"
			v-model:display-value="displayValueSettings"
			v-model:title="titleSetting"
		/>
		<ui-treemap
			v-if="heatmapData"
			:currency-symbol="heatmapData.currencySymbol"
			:size-by="activeSizeBy!.displayName"
			:display-value-name="activeDisplayValue!.displayName"
			:depth-range="activeColorDepth!"
			:visible-config="{
				isShowLogo: isShowLogo,
				isShowTicker: titleSetting !== TitleViewVariant.NONE,
				isSizeValuePercent: isSizeValuePercent,
				isDisplayValuePercent: isDisplayValuePercent,
			}"
			:data="heatmap"
		/>
	</div>

</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 18px;
}
</style>
