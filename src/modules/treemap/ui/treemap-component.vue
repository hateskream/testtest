<script setup lang="ts">
import type {
	IMarket,
	IColorBy,
	IColorDepth,
	ISettings,
	IMarketSettings,
	ISingleSetting,
	IColorDepthSetting,
	TitleViewVariant,
} from '../model';

import TreemapCrypto from './treemap-crypto.vue';
import TreemapStock from './treemap-stock.vue';
import TreemapForex from './treemap-forex.vue';

interface ITreemapCryptoProps {
	activeMarket: IMarket | undefined;
	activeColorBy: IColorBy | null;
	activeColorDepth: IColorDepth | null;
	activeSizeBy: ISettings | null;
	activeDisplayValue: ISettings | null;
	activeGroupBy: ISettings | null;
}

const props = defineProps<ITreemapCryptoProps>();

const marketSettings = defineModel<IMarketSettings>('market', { required: true });
const sizeBySettings = defineModel<ISingleSetting>('sizeBy', { required: true });
const colorBySettings = defineModel<ISingleSetting>('colorBy', { required: true });
const colorDepthSettings = defineModel<IColorDepthSetting>('colorDepth', { required: true });
const displayValueSettings = defineModel<ISingleSetting>('displayValue', { required: true });
const isShowLogo = defineModel<boolean>('isShowLogo', { required: true });
const groupBySettings = defineModel<ISingleSetting>('groupBy', { required: true });
const titleSetting = defineModel<TitleViewVariant>('title', { required: true });
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
			:active-market="props.activeMarket!"
			:active-color-by="props.activeColorBy!"
			:active-color-depth="props.activeColorDepth!"
			:active-size-by="props.activeSizeBy!"
			:active-display-value="props.activeDisplayValue!"
		/>
		<treemap-stock
			v-if="activeMarket.id === 'stock'"
			v-model:market="marketSettings"
			v-model:size-by="sizeBySettings"
			v-model:color-by="colorBySettings"
			v-model:color-depth="colorDepthSettings"
			v-model:group-by="groupBySettings"
			v-model:display-value="displayValueSettings"
			v-model:is-show-logo="isShowLogo"
			v-model:title="titleSetting"
			:active-market="props.activeMarket!"
			:active-color-by="props.activeColorBy!"
			:active-color-depth="props.activeColorDepth!"
			:active-size-by="props.activeSizeBy!"
			:active-group-by="props.activeGroupBy!"
			:active-display-value="props.activeDisplayValue!"
		/>
		<treemap-forex
			v-if="activeMarket.id === 'forex'"
			v-model:market="marketSettings"
			v-model:color-by="colorBySettings"
			v-model:color-depth="colorDepthSettings"
			v-model:display-value="displayValueSettings"
			v-model:is-show-logo="isShowLogo"
			v-model:title="titleSetting"
			:active-market="props.activeMarket!"
			:active-color-by="props.activeColorBy!"
			:active-color-depth="props.activeColorDepth!"
			:active-display-value="props.activeDisplayValue!"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-grow: 1;
}
</style>
