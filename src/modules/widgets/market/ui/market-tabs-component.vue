<script setup lang="ts">
import { computed, ref, useCssModule } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useMarketStore } from '../stores';
import type { ITableColumnDirection } from '../model';
import { UiPosition } from '@/shared/ui/position';
import { ModalBadge } from '../../base';
import { UiDelimiter } from '@/shared/ui/delimiter';

import MarketFiltersComponent from './market-filters-component.vue';
import MarketFilterCategoriesComponent from './market-filter-categories-component.vue';

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
	<div :class="classes.container">
		<div :class="classes.iconAllFilter">
			<ui-position position="right-start">
				<template #default>
					<ui-icon
						:id="IconIds.NewsFilter"
						width="20"
						height="20"
						:class="classes.iconAllFilterColor"
					/>
				</template>

				<template #content>
					<market-filters-component />
				</template>
			</ui-position>
		</div>

		<div :class="classes.lineDelimiterGroup">
			<ui-delimiter />
			<ui-delimiter />
		</div>

		<div>
			<modal-badge v-if="marketStore.activeFilterCategory">
				<template #title>
					{{ marketStore.activeFilterCategory.name }}

					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="classes.icon"
					/>
				</template>

				<template #content>
					<market-filter-categories-component />
				</template>
			</modal-badge>
		</div>

		<div :class="classes.lineDelimiterGroup">
			<ui-delimiter />
		</div>

		<div :class="classes.tabs">
			<div
				v-for="tab in activeTabs"
				:key="tab.name"
				:is-active="marketStore.activeTabSort.sortTab === tab.sortTab"
				:class="[
					classes.tab,
					{ [classes.tabActive]: marketStore.activeTabSort.sortTab === tab.sortTab },
				]"
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
		</div>
	</div>
</template>

<style module="classes">
.lineDelimiterGroup {
	display: flex;
	align-items: center;
	gap: 6px;
}

.container {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 8px;
}

.iconAllFilter {
	cursor: pointer;
}

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

.iconAllFilterColor {
	color: var(--icon-color-base-300);
}
</style>
