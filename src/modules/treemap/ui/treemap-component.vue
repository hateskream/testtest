<script setup lang="ts">
import { useQueryDisplaySettings } from '../query';
import { useDisplaySettings } from '../composables/';

import TreemapCrypto from './treemap-crypto.vue';
import TreemapStock from './treemap-stock.vue';
import TreemapForex from './treemap-forex.vue';

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
			v-model:market="marketSettings"
			v-model:size-by="sizeBySettings"
			v-model:color-by="colorBySettings"
			v-model:color-depth="colorDepthSettings"
			v-model:display-value="displayValueSettings"
			v-model:is-show-logo="isShowLogo"
			v-model:title="titleSetting"
			:active-market="activeMarket!"
			:active-color-by="activeColorBy!"
			:active-color-depth="activeColorDepth!"
			:active-size-by="activeSizeBy!"
			:active-display-value="activeDisplayValue!"
		/>
		<treemap-stock
			v-if="activeMarket.id === 'stock'"
			v-model:market="marketSettings"
			v-model:size-by="sizeBySettings"
			v-model:color-by="colorBySettings"
			v-model:color-depth="colorDepthSettings"
			v-model:active-group-by="activeGroupBy!"
			v-model:group-by="groupBySettings"
			v-model:display-value="displayValueSettings"
			v-model:is-show-logo="isShowLogo"
			v-model:title="titleSetting"
			:active-market="activeMarket!"
			:active-color-by="activeColorBy!"
			:active-color-depth="activeColorDepth!"
			:active-size-by="activeSizeBy!"
			:active-display-value="activeDisplayValue!"
		/>
		<treemap-forex
			v-if="activeMarket.id === 'forex'"
			v-model:market="marketSettings"
			v-model:color-by="colorBySettings"
			v-model:color-depth="colorDepthSettings"
			v-model:active-group-by="activeGroupBy!"
			v-model:group-by="groupBySettings"
			v-model:display-value="displayValueSettings"
			v-model:is-show-logo="isShowLogo"
			v-model:title="titleSetting"
			:active-market="activeMarket!"
			:active-color-by="activeColorBy!"
			:active-color-depth="activeColorDepth!"
			:active-display-value="activeDisplayValue!"
		/>
	</div>
</template>

<style module="classes">
.root {
	width: 100%;
	height: 100%;
}
</style>
