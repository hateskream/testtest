<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useNewsStore } from '../stores';
import type { IFilterList } from '../../base/model/filter-modal';
import { compareStrings } from '@/shared/lib';
import { UiPosition } from '@/shared/ui/position';
import { ModalItemCheckbox, ModalList } from '../../modal';

import NewsFilters from './news-filters-component.vue';

const newsFilters = useNewsStore();

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
			<modal-list
				v-for="(filter, key) in newsFilters.activeFilters"
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
					<modal-item-checkbox
						v-for="item in filter.list"
						:key="item.value"
						:model-value="
							(newsFilters.activeFilters[key].value as string[]).includes(item.value)
						"
						@update:model-value="
							newsFilters.toggleFiltersList(key as string, item.value)
						"
					>
						{{ item.label }}
					</modal-item-checkbox>
				</template>
			</modal-list>
		</div>
	</div>
</template>

<style module="classes">
.listFiltersTitle {
	display: flex;
	gap: 4px;
	align-items: center;
	height: 20px;
}

.container {
	display: flex;
	align-items: center;
	gap: 12px;
}

.listFilters {
	display: flex;
	align-items: center;
	gap: 6px;
}

.iconAllFilter {
	position: relative;
	z-index: 19;
	cursor: pointer;
}
</style>
