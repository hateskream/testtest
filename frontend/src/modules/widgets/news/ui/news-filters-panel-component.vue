<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useNewsStore } from '../stores';
import { compareStrings } from '@/shared/lib';
import { UiPosition } from '@/shared/ui/position';
import { ModalItemCheckbox, ModalBadgeList, ModalBadge, ModalFilterTicker } from '../../modal';
import type { IFilterList } from '../../modal/model';
import { UiImage } from '@/shared/ui/image';

import NewsFilters from './news-filters-component.vue';

const newsStore = useNewsStore();

function getTitleFilterList(
	filterName: string,
	value: string[],
	list: IFilterList<string>['list'],
) {
	if (value.length === 0) {
		return filterName;
	}

	const { label } = list.find(item => compareStrings(item.value, value[0]))!;

	return `${label} ${value.length > 1 ? `+${value.length - 1}` : ''}`;
}

const ACTIVE_TICKER_LIST_COUNT_SHOW = 3;
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.iconAllFilter">
			<ui-position>
				<template #default>
					<ui-icon
						:id="IconIds.NewsFilter"
						width="20"
						height="20"
						:class="classes.icon"
					/>
				</template>

				<template #content>
					<news-filters />
				</template>
			</ui-position>
		</div>

		<div :class="classes.listFilters">
			<modal-badge v-if="newsStore.activeTickersList.length > 0">
				<template #title>
					<div :class="classes.listFiltersTitle">
						<div :class="classes.listFiltersTitleImageWrapper">
							<div
								v-for="item in newsStore.activeTickersList.slice(
									0,
									ACTIVE_TICKER_LIST_COUNT_SHOW,
								)"
								:key="item.ticker"
								:class="classes.listFiltersTitleImage"
							>
								<ui-image
									:src="item.image"
									replacement="/images/market/ADA.png"
								/>
							</div>
						</div>

						<div
							v-if="
								newsStore.activeTickersList.length - ACTIVE_TICKER_LIST_COUNT_SHOW >
								0
							"
						>
							+{{
								newsStore.activeTickersList.length - ACTIVE_TICKER_LIST_COUNT_SHOW
							}}
						</div>

						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</div>
				</template>

				<template #content>
					<modal-filter-ticker
						:model-value="newsStore.tickerLists"
						@update:model-value="newsStore.setTickerLists"
					/>
				</template>
			</modal-badge>

			<modal-badge
				v-for="(filter, key) in newsStore.activeFilters"
				:key="key"
			>
				<template #title>
					<div :class="classes.listFiltersTitle">
						<div :class="classes.listFiltersTitleText">
							{{ getTitleFilterList(filter.name, filter.value, filter.list) }}
						</div>
						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</div>
				</template>

				<template #content>
					<modal-badge-list>
						<modal-item-checkbox
							v-for="item in filter.list"
							:key="item.value"
							:model-value="
								(newsStore.activeFilters[key].value as string[]).includes(
									item.value,
								)
							"
							@update:model-value="
								newsStore.toggleFiltersList(key as string, item.value)
							"
						>
							{{ item.label }}
						</modal-item-checkbox>
					</modal-badge-list>
				</template>
			</modal-badge>
		</div>
	</div>
</template>

<style module="classes">
.listFiltersTitle {
	display: flex;
	align-items: center;
	width: max-content;
	height: 20px;
	gap: 4px;
}

.listFiltersTitleImageWrapper {
	display: flex;
}

.listFiltersTitleImage {
	width: 28px;
	height: 28px;
	margin-left: -12px;
	overflow: hidden;
	background-color: #222223;
	border: 2px solid #222223;
	border-radius: 100%;
}

.listFiltersTitleImageWrapper > .listFiltersTitleImage:first-child {
	margin-left: 0;
}

.container {
	display: flex;
	align-items: center;
	gap: 12px;
}

.listFilters {
	display: flex;
	align-items: center;
	overflow: hidden;
	gap: 6px;
}

.iconAllFilter {
	cursor: pointer;
}
</style>
