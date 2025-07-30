<script setup lang="ts">
import { ref, watch } from 'vue';

import { useQueryDisplaySettings, useQueryHeatmap } from '../query';
import { useDisplaySettings, useHeatmap } from '../composables/';
import { UiTreemap } from '@/shared/ui/treemap';

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
} = useDisplaySettings(settings);

const excludeTickers = ref<string[]>([]);

const { data: heatmapData, refetch } = useQueryHeatmap(marketSettings.active, excludeTickers);

const { heatmap, isPercent } = useHeatmap(heatmapData, activeSizeBy, activeColorBy);

watch(() => marketSettings.active, () => {
	refetch();
});
</script>

<template>
	<settings-component
		:market="marketSettings"
		:size-by="sizeBySettings"
		:color-by="colorBySettings"
		:color-depth="colorDepthSettings"
		:display-value="displayValueSettings"
	/>
	<ui-treemap
		v-if="heatmapData"
		:currency-symbol="heatmapData.currencySymbol"
		:color-by="activeColorBy!.colorBy.displayName"
		:size-by="activeSizeBy!.displayName"
		:depth-range="activeColorDepth!"
		:visible-config="{
			isShowLogo: true,
			isShowTicker: true,
			isPercent: isPercent,
		}"
		:data="heatmap"
	/>
</template>

<style scoped>

</style>
