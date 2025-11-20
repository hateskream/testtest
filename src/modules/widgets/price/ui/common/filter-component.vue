<script setup lang="ts">
import { computed } from 'vue';

import { UiDelimiter } from '@/shared/ui/delimiter';
import { MarketBadge, ModalBadgeDropdown, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import type { MarketType } from '@/modules/market';
import { type FiltersState, type FiltersValues, FilterType, filterTypeToName, filterValueToDisplay } from '../../model';

interface IFilterComponentProps {
	filtersValues: FiltersValues;
	displayType: 'tv' | 'dashboard';
}

const props = defineProps<IFilterComponentProps>();

const activeMarket = defineModel<MarketType>('market', { required: true });
const filters = defineModel<FiltersState>('filters', { required: true });

const displayVariant = computed(() =>
	props.displayType === 'tv' ? 'default' : 'new',
);

const gapInPx = computed(() => props.displayType === 'tv' ? '6px' : '3px');

function updateFilter(filterKey: FilterType, filterValue: string) {
	filters.value = {
		...filters.value,
		[filterKey]: filterValue,
	};
}

const isTv = computed(()=>{
	return displayVariant.value === 'default';
});
</script>

<template>
	<div :class="classes.root">
		<market-badge
			v-model="activeMarket"
			:display-variant="displayVariant"
		/>
		<ui-delimiter v-if="isTv" />
		<modal-badge-dropdown
			v-for="(filterState, filterKey) in filters"
			:key="filterKey"
			:display-variant="displayVariant"
		>
			<template #title v-if="filterState">
				{{ filterValueToDisplay[filterState].label }}
			</template>
			<template #content>
				<modal-badge-list>
					<template #title>
						{{ filterTypeToName[filterKey] }}
					</template>
					<template
						v-for="filterValue in props.filtersValues[filterKey]"
						:key="filterValue.value"
					>
						<modal-item-selector
							:model-value="filterValue.value === filterState"
							@update:model-value="updateFilter(filterKey, filterValue.value)"
						>
							{{ filterValue.label }}
						</modal-item-selector>
					</template>
				</modal-badge-list>
			</template>
		</modal-badge-dropdown>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	gap: v-bind(gapInPx);
}
</style>
