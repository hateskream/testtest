<script setup lang="ts">
import { useNewsStore } from '../stores';
import { UiDriver } from '@/shared/ui/driver';
import { UiPosition } from '@/shared/ui/position';
import {
	ModalFilter,
	ModalFilterTabWrapper,
	ModalFilterTicker,
	ModalFilterTitle,
	ModalItemInteraction,
	ModalItemSelector,
} from '../../base';
import { FilterType } from '../../base/modal/model';

import NewsLocationFilterComponent from './news-location-filter-component.vue';

const newsStore = useNewsStore();
</script>

<template>
	<modal-filter>
		<template #title> Filter </template>

		<template #content>
			<div :class="classes.rowWrapper">
				<div
					v-for="(filter, key) in newsStore.filters"
					:key="key"
					:class="classes.row"
				>
					<div :class="classes.rowTitle">
						{{ filter.name }}
					</div>

					<div
						v-if="filter.type === FilterType.List"
						:class="classes.tabs"
					>
						<modal-filter-tab-wrapper
							v-for="item in filter.list"
							:key="`filter-${key}-${item.value}`"
							:is-active="
								(newsStore.filters[key].value as string[]).includes(item.value)
							"
							@click="newsStore.toggleFiltersList(key, item.value)"
						>
							{{ item.label }}
						</modal-filter-tab-wrapper>
					</div>
				</div>
			</div>

			<ui-position
				:position-offset="12"
				trigger="hover"
			>
				<template #default>
					<modal-item-interaction> Location </modal-item-interaction>
				</template>

				<template #content>
					<news-location-filter-component />
				</template>
			</ui-position>

			<ui-position
				:position-offset="12"
				trigger="hover"
			>
				<template #default>
					<modal-item-interaction> Ticker </modal-item-interaction>
				</template>

				<template #content>
					<modal-filter-ticker
						:model-value="newsStore.tickerLists"
						@update:model-value="newsStore.setTickerLists"
					/>
				</template>
			</ui-position>

			<ui-driver />

			<div>
				<modal-filter-title> Sort By </modal-filter-title>

				<modal-item-selector
					v-for="sort in newsStore.sortBy"
					:key="sort.key"
					:model-value="sort.value"
					@update:model-value="newsStore.setSort(sort)"
				>
					{{ sort.name }}
				</modal-item-selector>
			</div>
		</template>
	</modal-filter>
</template>

<style module="classes">
.tabs {
	display: flex;
	gap: 8px;
	align-items: center;
}

.row {
	display: flex;
	align-items: center;
	padding: 4px 12px;
}

.rowTitle {
	flex: 0 100px;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
}

.rowTitle::first-letter {
	text-transform: uppercase;
}
</style>
