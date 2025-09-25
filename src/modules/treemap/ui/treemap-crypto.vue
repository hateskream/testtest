<script setup lang="ts">
import { computed, ref } from 'vue';

import { useHeatmapCrypto } from '../composables';
import type {
	IColorBy,
	IColorDepth,
	IColorDepthSetting,
	IMarket,
	IMarketSettings,
	ISettings,
	ISingleSetting,
} from '../model';
import { TitleViewVariant } from '../model';
import { useQueryHeatmapCrypto } from '../query';
import { UiTreemap } from '@/shared/ui/treemap';
import { IconIds } from '@/shared/ui/icon';

import SettingsBase from './settings-base.vue';
import SettingComponent from './setting-component.vue';

interface ITreemapCryptoProps {
	activeMarket: IMarket;
	activeColorBy: IColorBy;
	activeColorDepth: IColorDepth;
	activeSizeBy: ISettings;
	activeDisplayValue: ISettings;

	isShowDots: boolean;
	isNegativeColorMarket: boolean;
}

const props = defineProps<ITreemapCryptoProps>();

const market = defineModel<IMarketSettings>('market', { required: true });
const sizeBy = defineModel<ISingleSetting>('sizeBy', { required: true });
const colorBy = defineModel<ISingleSetting>('colorBy', { required: true });
const colorDepth = defineModel<IColorDepthSetting>('colorDepth', { required: true });
const displayValue = defineModel<ISingleSetting>('displayValue', { required: true });
const isShowLogo = defineModel<boolean>('isShowLogo', { required: true });
const title = defineModel<TitleViewVariant>('title', { required: true });

const excludeTickers = ref<string[]>([]);

const { data: heatmapData } = useQueryHeatmapCrypto(excludeTickers);

const {
	heatmap,
	isSizeValuePercent,
	isDisplayValuePercent,
} = useHeatmapCrypto(
	heatmapData,
	computed(() => props.activeSizeBy),
	computed(() => props.activeColorBy),
	computed(() => props.activeDisplayValue),
	title,
);
</script>

<template>
	<div :class="classes.root">
		<settings-base
			v-model:market="market"
			v-model:color-by="colorBy"
			v-model:color-depth="colorDepth"
			v-model:display-value="displayValue"
			v-model:is-show-logo="isShowLogo"
			v-model:title="title"
			:active-market="props.activeMarket"
			:active-color-by="props.activeColorBy"
			:active-color-depth="props.activeColorDepth"
			:active-display-value="props.activeDisplayValue"
			:is-show-dots="props.isShowDots"
			:is-negative-color-market="props.isNegativeColorMarket"
		>
			<setting-component
				title="Size by"
				:setting="sizeBy"
				:active="activeSizeBy"
				:icon="IconIds.Size"
			/>
		</settings-base>
		<ui-treemap
			v-if="heatmapData"
			:currency-symbol="heatmapData.currencySymbol"
			:size-by="activeSizeBy!.displayName"
			:display-value-name="activeDisplayValue!.displayName"
			:depth-range="activeColorDepth!"
			:visible-config="{
				isShowLogo: isShowLogo,
				isShowTicker: title !== TitleViewVariant.NONE,
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
