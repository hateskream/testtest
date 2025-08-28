<script setup lang="ts">
import { computed, ref } from 'vue';

import { useHeatmapStock } from '../composables';
import type {
	IColorBy,
	IColorDepth,
	IColorDepthSetting,
	IMarket,
	IMarketSettings,
	ISettings,
	ISingleSetting,
} from '../model';
import { NO_GROUP, TitleViewVariant } from '../model';
import { useQueryHeatmapStock } from '../query';
import { UiTreemap, UiTreemapLayout } from '@/shared/ui/treemap';
import { IconIds } from '@/shared/ui/icon';

import SettingsBase from './settings-base.vue';
import SettingComponent from './setting-component.vue';

interface ITreemapCryptoProps {
	activeMarket: IMarket;
	activeColorBy: IColorBy;
	activeColorDepth: IColorDepth;
	activeSizeBy: ISettings;
	activeGroupBy: ISettings | null;
	activeDisplayValue: ISettings;
}

const props = defineProps<ITreemapCryptoProps>();

const market = defineModel<IMarketSettings>('market', { required: true });
const sizeBy = defineModel<ISingleSetting>('sizeBy', { required: true });
// const groupBy = defineModel<ISingleSetting>('groupBy', { required: true });
const colorBy = defineModel<ISingleSetting>('colorBy', { required: true });
const colorDepth = defineModel<IColorDepthSetting>('colorDepth', { required: true });
const displayValue = defineModel<ISingleSetting>('displayValue', { required: true });
const isShowLogo = defineModel<boolean>('isShowLogo', { required: true });
const title = defineModel<TitleViewVariant>('title', { required: true });

const { data: heatmapData } = useQueryHeatmapStock();

const selectGroup = ref<string | null>(null);

const {
	heatmap,
	group,
	isSizeValuePercent,
	isDisplayValuePercent,
} = useHeatmapStock(
	heatmapData,
	computed(() => props.activeSizeBy),
	computed(() => props.activeColorBy),
	computed(() => props.activeDisplayValue),
	computed(() => props.activeGroupBy),
	selectGroup,
	title,
);

const breadcrumbs = computed(() =>
	selectGroup.value ? [{ id: selectGroup.value, name: selectGroup.value }]: [],
);

function setSelectGroup(id: string | null) {
	selectGroup.value = id;
}
</script>

<template>
	<div :class="classes.root">
		<settings-base
			:market="market"
			:color-by="colorBy"
			:color-depth="colorDepth"
			:display-value="displayValue"
			:is-show-logo="isShowLogo"
			:title="title"
			:active-market="props.activeMarket"
			:active-color-by="props.activeColorBy"
			:active-color-depth="props.activeColorDepth"
			:active-display-value="props.activeDisplayValue"
		>
			<setting-component
				title="Size by"
				:setting="sizeBy"
				:active="activeSizeBy"
				:icon="IconIds.Size"
			/>
			<!-- <setting-component
				title="Group by"
				:setting="groupBy"
				:active="activeGroupBy"
				:icon="IconIds.GroupBy"
			/> -->
		</settings-base>
		<ui-treemap-layout :data="group">
			<template  #default="{ item: { id } }">
				<div :class="classes.group">
					<div v-if="id !== NO_GROUP.key && !selectGroup" @click="setSelectGroup(id)">{{ id }}</div>
					<ui-treemap
						v-if="heatmapData"
						:original-breadcrumbs="breadcrumbs"
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
						:data="heatmap[id]"
						@click-all="setSelectGroup(null)"
					/>
				</div>
			</template>
		</ui-treemap-layout>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 18px;
}

.group {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
</style>
