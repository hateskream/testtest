<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useMarketStore } from '../stores';
import type { ITableColumnDirection } from '../model';

import TabWrapperComponent from './tab-wrapper-component.vue';

const marketStore = useMarketStore();

interface ITab {
	name: string;
	icon?: IconIds;
	sortTab: string;
	columnName?: string;
	direction: ITableColumnDirection;
	timeframe?: string;
}

const tabs: ITab[] = [
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
];

const activeTabs = computed(() =>
	tabs.filter(tab => !tab.columnName || marketStore.showTableColumns.includes(tab.columnName)),
);
</script>
<template>
	<div :class="classes.tabs">
		<tab-wrapper-component
			v-for="tab in activeTabs"
			:key="tab.name"
			:is-active="marketStore.activeTabSort.sortTab === tab.sortTab"
			@click="
				marketStore.setActiveTabSort({
					direction: tab.direction,
					sortTab: tab.sortTab,
					columnName: tab.columnName,
					timeframe: tab.timeframe,
				})
			"
		>
			<ui-icon
				v-if="tab.icon"
				:id="tab.icon"
				width="20px"
				height="20px"
				:class="classes.iconWrapper"
			/>
			{{ tab.name }}
			{{ tab.timeframe }}
		</tab-wrapper-component>
	</div>
</template>

<style module="classes">
.tabs {
	display: flex;
	gap: 7px;
	margin-bottom: 7px;
}

.iconWrapper {
	color: var(--icon-color-base-300);
	cursor: pointer;
}
</style>
