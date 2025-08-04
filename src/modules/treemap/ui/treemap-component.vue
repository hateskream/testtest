<script setup lang="ts">
import { useQueryDisplaySettings } from '../query';
import { useDisplaySettings } from '../composables/';

import TreemapCrypto from './treemap-crypto.vue';
import TreemapStock from './treemap-stock.vue';

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
	activeGroupBy,
	groupBySettings,
} = useDisplaySettings(settings);
</script>

<template>
	<div v-if="activeMarket" :class="classes.root">
		<treemap-crypto
			v-if="activeMarket.id === 'crypto'"
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
		<treemap-stock
			v-if="activeMarket.id === 'stock'"
			:active-market="activeMarket!"
			:active-color-by="activeColorBy!"
			:active-color-depth="activeColorDepth!"
			:active-size-by="activeSizeBy!"
			:active-display-value="activeDisplayValue!"
			:market="marketSettings"
			:size-by="sizeBySettings"
			:color-by="colorBySettings"
			:color-depth="colorDepthSettings"
			:active-group-by="activeGroupBy!"
			:group-by="groupBySettings"
			:display-value="displayValueSettings"
			:is-show-logo="isShowLogo"
			:title="titleSetting"
		/>
	</div>
</template>

<style module="classes">
.root {
	width: 100%;
	height: 100%;
}
</style>
