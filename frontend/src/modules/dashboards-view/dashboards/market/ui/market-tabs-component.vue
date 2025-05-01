<script setup lang="ts">
import { computed, ref, useCssModule } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useMarketStore } from '../stores';
import type { ITableColumnDirection } from '../model';

const marketStore = useMarketStore();

interface ITab {
	name: string;
	sortTab: string;
	columnName?: string;
	direction: ITableColumnDirection;
	iconColorClass?: string;

	icon?: {
		name: IconIds;
		iconColorClass: string;
		width: string;
		height: string;
	};
}

const classes = useCssModule('classes');

const tabs = ref<ITab[]>([
	{
		name: 'All',
		sortTab: 'all',
		direction: 0,
	},
	{
		name: 'Gainers',
		icon: {
			name: IconIds.Gainers,
			height: '14',
			width: '14',
			iconColorClass: classes.iconGainersColor,
		},
		iconColorClass: classes.iconGainersColor,
		sortTab: 'gainers',
		columnName: 'chg24h',
		direction: -1,
	},
	{
		name: 'Losers',
		icon: {
			name: IconIds.Loosers,
			height: '46',
			width: '14',
			iconColorClass: classes.iconLoosersColor,
		},
		sortTab: 'losers',
		columnName: 'chg24h',
		direction: 1,
	},
	{
		name: 'New',
		sortTab: 'new',
		columnName: 'listingDate',
		direction: -1,
	},
	{
		name: 'Upcoming',
		sortTab: 'upcoming',
		direction: 0,
	},
]);

const activeTabs = computed(() =>
	tabs.value.filter(
		tab => !tab.columnName || marketStore.showTableColumns.includes(tab.columnName),
	),
);
</script>
<template>
	<div :class="classes.tabs">
		<div
			v-for="tab in activeTabs"
			:key="tab.name"
			:is-active="marketStore.activeTabSort.sortTab === tab.sortTab"
			:class="[
				classes.tab,
				{ [classes.tabActive]: marketStore.activeTabSort.sortTab === tab.sortTab },
			]"
			@click="marketStore.setActiveTabSort(tab)"
		>
			<ui-icon
				v-if="tab.icon"
				:id="tab.icon.name"
				:width="tab.icon.width"
				:height="tab.icon.height"
				:class="[classes.iconWrapper, tab.icon.iconColorClass]"
			/>

			{{ tab.name }}
		</div>

		<!-- <base-filter-modal-tab-wrapper
			:is-active="marketStore.isFavorites"
			@click.prevent.stop="marketStore.toggleFavorites"
		>
			<ui-icon
				:id="IconIds.FavoriteFill"
				width="20px"
				height="20px"
				:class="classes.iconFavorite"
			/>
		</base-filter-modal-tab-wrapper> -->
	</div>
</template>

<style module="classes">
.iconGainersColor {
	color: rgb(206 255 139 / 100%);
}

.iconLoosersColor {
	color: rgb(248 89 97 / 50%);
}

.tabs {
	display: flex;
	align-items: center;
	width: max-content;
	margin-bottom: 8px;
	padding: 2px;
	background: var(--bg-color-base-300);
	border-radius: 9999px;
	gap: 2px;
}

.tab {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 28px;
	padding: 4px 12px;
	font-weight: 380;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.04px;
	gap: 2px;
}

.tabActive {
	background: var(--bg-color-base-300-activated);
	border-radius: 28px;
}

.iconWrapper {
	flex: 14px;
	cursor: pointer;
}

.iconFavorite {
	color: var(--icon-color-base-300);
}
</style>
