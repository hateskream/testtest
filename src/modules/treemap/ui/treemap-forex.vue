<!-- eslint-disable @stylistic/max-len -->
<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiHeatmap } from '@/shared/ui/treemap';
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
import { useQueryHeatmapForex } from '../query';
import { useHeatmapForex } from '../composables';

import SettingsBase from './settings-base.vue';

interface ITreemapCryptoProps {
	activeMarket: IMarket;
	activeColorBy: IColorBy;
	activeColorDepth: IColorDepth;
	activeDisplayValue: ISettings;

	isShowDots: boolean;
	isNegativeColorMarket: boolean;
}

const props = defineProps<ITreemapCryptoProps>();

const market = defineModel<IMarketSettings>('market', { required: true });
const colorBy = defineModel<ISingleSetting>('colorBy', { required: true });
const colorDepth = defineModel<IColorDepthSetting>('colorDepth', { required: true });
const displayValue = defineModel<ISingleSetting>('displayValue', { required: true });
const isShowLogo = defineModel<boolean>('isShowLogo', { required: true });
const title = defineModel<TitleViewVariant>('title', { required: true });

const timeRange = ref('1d');

const { data: heatmapData } = useQueryHeatmapForex(timeRange);

const {
	heatmap,
	isDisplayValuePercent,
} = useHeatmapForex(
	heatmapData,
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
		/>
		<ui-heatmap
			:data="heatmap"
			:depth-range="activeColorDepth!"
			:visible-config="{
				isShowLogo: isShowLogo,
				isShowTicker: title !== TitleViewVariant.NONE,
				isDisplayValuePercent: isDisplayValuePercent,
			}"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 18px;
	height: 100%;
}
</style>
