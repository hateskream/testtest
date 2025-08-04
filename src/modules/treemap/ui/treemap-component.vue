<script setup lang="ts">
import { useQueryDisplaySettings } from '../query';
import { useDisplaySettings } from '../composables/';

import TreemapCrypto from './treemap-crypto.vue';

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
	activeMarket,
} = useDisplaySettings(settings);
</script>

<template>
	<treemap-crypto
		v-if="activeMarket"
		:active-market="activeMarket!"
		:active-color-by="activeColorBy!"
		:active-color-depth="activeColorDepth!"
		:active-size-by="activeSizeBy!"
		:active-display-value="activeDisplayValue!"
		:market="marketSettings"
		:size-by="sizeBySettings"
		:color-by="colorBySettings"
		:color-depth="colorDepthSettings"
		:display-value="displayValueSettings"
		:is-show-logo="isShowLogo"
		:title="titleSetting"
	/>
</template>

