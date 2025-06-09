<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useNewsStore } from '../stores';
import { compareStrings } from '@/shared/lib';
import { UiPosition } from '@/shared/ui/position';
import {
	ModalBadgeList,
	ModalBadge,
	ModalFilterTicker,
	ModalItemSelector,
	ModalItemCheckbox,
} from '../../base';
import type { IFilterList } from '../../base/modal/model';
import { UiImage } from '@/shared/ui/image';
import { UiDelimiter } from '@/shared/ui/delimiter';

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
						:class="classes.iconAllFilterColor"
					/>
				</template>

				<template #content>
					<news-filters />
				</template>
			</ui-position>
		</div>

		<ui-delimiter />

		<div :class="classes.listFilters">
			<div
				v-if="newsStore.activeTickersList.length > 0"
				:class="classes.listFilterWithDelimiter"
			>
				<modal-badge>
					<template #title>
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
					</template>

					<template #content>
						<modal-filter-ticker
							:model-value="newsStore.tickerLists"
							@update:model-value="newsStore.setTickerLists"
						/>
					</template>
				</modal-badge>
				<ui-delimiter />
			</div>

			<div
				v-for="(filter, key, idx) in newsStore.activeFilters"
				:key="key"
				:class="classes.listFilterWithDelimiter"
			>
				<modal-badge>
					<template #title>
						{{ getTitleFilterList(filter.name, filter.value, filter.list) }}

						<ui-icon
							:id="IconIds.DropdownDown"
							width="12"
							height="12"
							:class="classes.icon"
						/>
					</template>

					<template #content>
						<modal-badge-list>
							<template #title>
								{{ key }}
							</template>

							<template
								v-for="item in filter.list"
								:key="item.value"
							>
								<modal-item-checkbox
									v-if="filter.multiple"
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

								<modal-item-selector
									v-else
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
								</modal-item-selector>
							</template>
						</modal-badge-list>
					</template>
				</modal-badge>

				<ui-delimiter v-if="idx !== Object.keys(newsStore.activeFilters).length - 1" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
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
	gap: 6px;
}

.listFilters {
	display: flex;
	align-items: center;
	max-width: 100%;
	height: 42px;
	padding-bottom: 4px;
	overflow-x: auto;
	gap: 6px;
}

.iconAllFilter {
	cursor: pointer;
}

.iconAllFilterColor {
	color: var(--icon-color-base-300);
}

.listFilterWithDelimiter {
	display: flex;
	align-items: center;
	gap: 6px;
}
</style>
