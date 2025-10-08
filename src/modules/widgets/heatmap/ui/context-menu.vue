<script setup lang="ts">
import { computed } from 'vue';

import { ChangeDisplay, InteractionSettings } from '@/modules/treemap';
import { ModalSubmenu, WidgetContextMenu, ModalBadgeList } from '@/modules/widgets/base';
import type {
	IColorBy,
	IColorDepth,
	IColorDepthSetting,
	IMarket,
	IMarketSettings,
	ISettings,
	ISingleSetting,
	TitleViewVariant,
} from '../model';

interface IProps {
	activeMarket: IMarket;
	activeColorBy: IColorBy;
	activeColorDepth: IColorDepth;
	activeSizeBy: ISettings | null;
	activeDisplayValue: ISettings;
	activeGroupBy: ISettings | null;

	title: string;

	dashboards: {
		id: string;
		name: string;
	}[];
}

const props = defineProps<IProps>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'reset'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const marketSettings = defineModel<IMarketSettings>('market', { required: true });
const sizeBySettings = defineModel<ISingleSetting>('sizeBy', { required: true });
const colorBySettings = defineModel<ISingleSetting>('colorBy', { required: true });
const colorDepthSettings = defineModel<IColorDepthSetting>('colorDepth', { required: true });
const displayValueSettings = defineModel<ISingleSetting>('displayValue', { required: true });
const isShowLogo = defineModel<boolean>('isShowLogo', { required: true });
// const groupBySettings = defineModel<ISingleSetting>('groupBy', { required: true });
const titleVariant = defineModel<TitleViewVariant>('titleVariant', { required: true });


const hasSizeBy = computed(() => props.activeMarket.id === 'crypto' || props.activeMarket.id === 'stock');
// const hasTickers = computed(() => false);
const hasColorDepth = computed(() => props.activeMarket.id === 'forex' );

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

// const titleTickest = computed(() => '');

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
	const percent = props.activeColorBy.colorBy.isPercent ? '%' : '';

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
	<widget-context-menu
		:title="props.title"
		:dashboards="props.dashboards"
		@delete="emit('delete')"
		@reset="emit('reset')"
		@move-to="emit('moveTo', $event)"
		@duplicate="emit('duplicate')"
	>
		<modal-submenu>
			<template #title>Change display</template>
			<template #content>
				<change-display
					v-model:display-value="displayValueSettings"
					v-model:is-show-logo="isShowLogo"
					v-model:title="titleVariant"
					:active-display-value="props.activeDisplayValue"
				/>
			</template>
		</modal-submenu>
		<modal-submenu>
			<template #title>Filter</template>
			<template #content>
				<modal-badge-list>
					<interaction-settings
						v-model="marketSettingsProxy"
						title="Market"
						:active="mapMarketToSettings(props.activeMarket)"
					/>
					<interaction-settings
						v-model="colorBySettings"
						title="Color by"
						:active="props.activeColorBy.colorBy"
					/>
					<interaction-settings
						v-if="hasSizeBy && props.activeSizeBy"
						v-model="sizeBySettings"
						title="Size by"
						:active="props.activeSizeBy"
					/>
					<interaction-settings
						v-if="hasColorDepth"
						v-model="colorDepthSettingsProxy"
						title="Color depth"
						:active="mapColorDepthToSettings(props.activeColorDepth)"
					/>
				</modal-badge-list>
			</template>
		</modal-submenu>
	</widget-context-menu>
</template>
