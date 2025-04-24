<script setup lang="ts">
import { computed, ref } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useMarketStore } from '../stores';
import type { ITableColumnDirection } from '../model';
import { BaseFilterModalTabWrapper } from '../../base';

import TabTimeframeComponent from './tab-timeframe-component.vue';

const marketStore = useMarketStore();

interface ITab {
	name: string;
	icon?: IconIds;
	sortTab: string;
	columnName?: string;
	direction: ITableColumnDirection;
	timeframe?: string;
}

const tabs = ref<ITab[]>([
	{
		name: 'All',
		sortTab: 'all',
		direction: 0,
	},
	{
		name: 'Gainers',
		icon: IconIds.Gainers,
		sortTab: 'gainers',
		columnName: 'chg24h',
		direction: -1,
		timeframe: '24h',
	},
	{
		name: 'Losers',
		icon: IconIds.Loosers,
		sortTab: 'losers',
		columnName: 'chg24h',
		direction: 1,
		timeframe: '24h',
	},
	{
		name: 'New',
		sortTab: 'new',
		columnName: 'listingDate',
		direction: -1,
		timeframe: '24h',
	},
	{
		name: 'Upcoming',
		sortTab: 'upcoming',
		direction: 0,
	},
]);

function setActiveTabTimeframe(idx: number, timeframe: string) {
	tabs.value[idx].timeframe = timeframe;

	marketStore.setActiveTabTimeframe(tabs.value[idx]);
}

const activeTabs = computed(() =>
	tabs.value.filter(
		tab => !tab.columnName || marketStore.showTableColumns.includes(tab.columnName),
	),
);
</script>
<template>
	<div :class="classes.tabs">
		<base-filter-modal-tab-wrapper
			v-for="(tab, idx) in activeTabs"
			:key="tab.name"
			:is-active="marketStore.activeTabSort.sortTab === tab.sortTab"
			@click="marketStore.setActiveTabSort(tab)"
		>
			<ui-icon
				v-if="tab.icon"
				:id="tab.icon"
				width="20px"
				height="20px"
				:class="classes.iconWrapper"
			/>

			{{ tab.name }}

			<tab-timeframe-component
				v-if="tab.timeframe"
				:model-value="tab.timeframe"
				@update:model-value="setActiveTabTimeframe(idx, $event)"
			/>
		</base-filter-modal-tab-wrapper>

		<base-filter-modal-tab-wrapper
			:is-active="marketStore.isFavorites"
			@click.prevent.stop="marketStore.toggleFavorites"
		>
			<ui-icon
				:id="IconIds.FavoriteFill"
				width="20px"
				height="20px"
				:class="classes.iconFavorite"
			/>
		</base-filter-modal-tab-wrapper>
	</div>
</template>

<style module="classes">
.tabs {
	display: flex;
	margin-bottom: 7px;
	padding-bottom: 12px;
	gap: 7px;
}

.iconWrapper {
	color: var(--icon-color-base-300);
	cursor: pointer;
}

.iconFavorite {
	color: var(--icon-color-base-300);
}
</style>
