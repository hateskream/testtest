<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseWidgetTvComponent } from '../../base/index.ts';
import { useHeatmap } from '../composables';
import { BaseErrorComponent } from '@/modules/widgets/base';
import { ChangeDisplay, InteractionSettings } from '@/modules/treemap';
import type {
	IColorDepth,
	IColorDepthSetting,
	IMarket,
	IMarketSettings,
	ISettings,
	ISingleSetting,
} from '../model/display-settings.ts';

import HeatmapLoader from './preloader-component.vue';

const MainComponent = defineAsyncComponent({
	loader: () => import('@/modules/treemap').then(c => c.TreemapComponent),
	loadingComponent: HeatmapLoader,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const {
	isError,
	isLoading,

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
	resetAllChanges,
	refetch,
	applyStateToParent,
} = useHeatmap({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
});

const hasSizeBy = computed(() => activeMarket.value?.id === 'crypto' || activeMarket.value?.id === 'stock');
const hasColorDepth = computed(() => activeMarket.value?.id === 'forex' );

const marketSettingsProxy = computed<ISingleSetting>({
	get: () => mapMarketToSingleSettings(marketSettings.value),
	set: (val) => {
		marketSettings.value = mapSingleSettingsToMarket(val);
	},
});

const colorDepthSettingsProxy = computed<ISingleSetting>({
	get: () => mapColorDepthToSingleSettings(colorDepthSettings.value),
	set: (val) => {
		colorDepthSettings.value = mapSingleSettingsToColorDepth(val);
	},
});


function mapMarketToSettings(market: IMarket): ISettings {
	return {
		key: market.id,
		displayName: market.displayName,
		isPercent: false,
	};
}

function mapMarketToSingleSettings(market: IMarketSettings): ISingleSetting {
	return {
		active: market.active,
		values: market.markets.map(mapMarketToSettings),
	};
}

function mapSingleSettingsToMarket(setting: ISingleSetting): IMarketSettings {
	return {
		active: setting.active,
		markets: setting.values.map(v => ({
			id: v.key,
			displayName: v.displayName,
		})),
	};
}

function createDisplayValueColorDepth({ end, start }: IColorDepth) {
	const percent = activeColorBy.value?.colorBy.isPercent ? '%' : '';

	return `${start}${percent} to ${end}${percent}`;
}

function mapColorDepthToSettings(cd: IColorDepth): ISettings {
	return {
		key: cd.id,
		displayName: createDisplayValueColorDepth(cd),
		isPercent: false,
	};
}

function mapColorDepthToSingleSettings(cd: IColorDepthSetting): ISingleSetting {
	return {
		active: cd.active,
		values: cd.values.map(mapColorDepthToSettings),
	};
}

function mapSingleSettingsToColorDepth(setting: ISingleSetting): IColorDepthSetting {
	return {
		active: setting.active,
		values: setting.values
			.map(v => {
				const [start, end] = v.displayName.split(' to ').map(x => parseFloat(x));
				return {
					id: v.key,
					start,
					end,
				};
			}),
	};
}
</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@apply-changes="applyStateToParent"
		@retry="refetch"
	>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<heatmap-loader v-if="isLoading || props.meta.isLoading" />
			<base-error-component v-else-if="isError" @retry="refetch" />

			<div v-else :class="classes.heatmap">
				<main-component
					v-model:market="marketSettings"
					v-model:size-by="sizeBySettings"
					v-model:color-by="colorBySettings"
					v-model:color-depth="colorDepthSettings"
					v-model:display-value="displayValueSettings"
					v-model:group-by="groupBySettings"
					v-model:is-show-logo="isShowLogo"
					v-model:title="titleSetting"
					display-variant="new"
					:active-market="activeMarket"
					:active-color-by="activeColorBy"
					:active-color-depth="activeColorDepth"
					:active-size-by="activeSizeBy"
					:active-display-value="activeDisplayValue"
					:active-group-by="activeGroupBy"
					:is-show-dots="false"
					:is-negative-color-market="false"
					is-no-group-stock
				/>
			</div>
		</template>
		<template #change-display>
			<change-display
				v-if="activeDisplayValue"
				v-model:display-value="displayValueSettings"
				v-model:is-show-logo="isShowLogo"
				v-model:title="titleSetting"
				display-variant="new"
				:active-display-value="activeDisplayValue"
			/>
		</template>
		<template #filter>
			<interaction-settings
				v-if="activeMarket"
				v-model="marketSettingsProxy"
				title="Market"
				display-variant="new"
				:active="mapMarketToSettings(activeMarket)"
			/>
			<interaction-settings
				v-if="activeColorBy"
				v-model="colorBySettings"
				title="Color by"
				display-variant="new"
				:active="activeColorBy.colorBy"
			/>
			<interaction-settings
				v-if="hasSizeBy && activeSizeBy"
				v-model="sizeBySettings"
				title="Size by"
				display-variant="new"
				:active="activeSizeBy"
			/>
			<interaction-settings
				v-if="hasColorDepth && activeColorDepth"
				v-model="colorDepthSettingsProxy"
				title="Color depth"
				display-variant="new"
				:active="mapColorDepthToSettings(activeColorDepth)"
			/>
		</template>
	</base-widget-tv-component>
</template>

<style module="classes">
.heatmap {
	position: relative;
	display: flex;
	height: 100%;
}
</style>
