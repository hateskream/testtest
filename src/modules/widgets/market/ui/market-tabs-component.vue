<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { FiltersState, FiltersValues } from '../model';
import { UiPosition } from '@/shared/ui/position';
import { MarketBadge } from '../../base';
import { UiDelimiter } from '@/shared/ui/delimiter';
import type { MarketType } from '@/modules/market';
import type { ITableColumn } from '@/modules/cell';

import MarketFiltersComponent from './market-filters-component.vue';

interface IMarketTabsComponentProps {
	filtersValues: FiltersValues;
}

const props = defineProps<IMarketTabsComponentProps>();

const market = defineModel<MarketType>('market', { required: true });
const filters = defineModel<FiltersState>('filters', { required: true });
const columns = defineModel<ITableColumn[]>('columns', { required: true });

function updateFilter(filterKey: string, filterValue: string) {
	filters.value = {
		...filters.value,
		[filterKey]: {
			...filters.value[filterKey],
			selected: filterValue,
		},
	};
}
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
					<market-filters-component
						v-model:market="market"
						v-model:columns="columns"
					/>
				</template>
			</ui-position>
		</div>

		<div :class="classes.lineDelimiterGroup">
			<ui-delimiter />
			<ui-delimiter />
		</div>

		<market-badge
			v-model="market"
			title="Categories"
		/>

		<div :class="classes.lineDelimiterGroup">
			<ui-delimiter />
		</div>

		<div :class="classes.tabs">
			<div
				v-for="(filterState, filterKey) in filters"
				:key="filterKey"
				:class="classes.tabs"
			>
				<div
					v-for="filterValue in props.filtersValues[filterKey]"
					:key="filterValue.value"
					:is-active="filterValue.value === filterState.selected"
					:class="[
						classes.tab,
						{ [classes.tabActive]: filterValue.value === filterState.selected },
					]"
					@click="updateFilter(filterKey, filterValue.value)"
				>
					<ui-icon
						v-if="filterValue.icon"
						:id="filterValue.icon.id"
						:class="[classes.iconWrapper]"
						:style="{ color: filterValue.icon.color }"
					/>

					{{ filterValue.name }}
				</div>
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
	pointer-events: none;
}

.iconWrapper {
	flex: 14px;
	cursor: pointer;
}

.iconAllFilterColor {
	color: var(--icon-color-base-300);
}
</style>
