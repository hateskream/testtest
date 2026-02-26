<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { FiltersState, FiltersValues } from '../../model';
import { UiPosition } from '@/shared/ui/position';
import { MarketBadge } from '../../../base';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { MarketType } from '@/modules/market';
import type { ITableColumn } from '@/modules/cell';

import MarketFiltersComponent from './market-filters-component.vue';

interface IMarketTabsComponentProps {
	displayVariant: 'default' | 'new';
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
		<market-badge
			v-model="market"
			:exclude-markets="[MarketType.Etf]"
			title="Categories"
		/>

		<div :class="[classes.lineDelimiterGroup, classes.preAllFilter]">
			<ui-delimiter />
		</div>

		<div :class="classes.iconAllFilter">
			<ui-position placement="right-start">
				<template #title>
					<ui-icon
						:id="IconIds.NewsFilter"
						width="20"
						height="20"
						:class="classes.iconAllFilterColor"
					/>
				</template>

				<template #content>
					<market-filters-component
						v-model:filters="filters"
						v-model:market="market"
						v-model:columns="columns"
						:display-variant
						:filters-values="props.filtersValues"
					/>
				</template>
			</ui-position>
		</div>

		<div :class="[classes.lineDelimiterGroup, classes.postAllFilter]">
			<ui-delimiter />
		</div>

		<div
			v-for="(filterState, filterKey) in filters"
			:key="filterKey"
			:class="classes.tabs"
		>
			<div
				v-for="filterValue in props.filtersValues[filterKey]"
				:key="filterValue.value"
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
	container: toolbar / inline-size;
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

.preAllFilter {
	display: none;
}

.iconAllFilter {
	display: none;
	cursor: pointer;
}

.iconAllFilterColor {
	color: var(--icon-color-base-300);
}

@container toolbar (max-width: 500px) {
	.tabs {
		display: none;
	}

	.preAllFilter {
		display: unset;
	}

	.iconAllFilter {
		display: unset;
	}

	.postAllFilter {
		display: none;
	}
}
</style>
