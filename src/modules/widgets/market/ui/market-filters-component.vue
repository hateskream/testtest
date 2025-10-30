<script setup lang="ts">
import { MarketBadgeList, ModalBadgeList, ModalItemSelector, ModalSubmenu } from '../../base';
import type { MarketType } from '@/modules/market';
import type { ITableColumn } from '@/modules/cell';
import type { FiltersState, FiltersValues } from '@/modules/widgets/market/model';

import TableColumnsSettingsComponent from './table-columns-settings-component.vue';

const market = defineModel<MarketType>('market', { required: true });
const columns = defineModel<ITableColumn[]>('columns', { required: true });
const filters = defineModel<FiltersState>('filters', { required: true });

const props = defineProps<{
	filtersValues: FiltersValues;
}>();

const emits = defineEmits<{
	updateFilter: [key: string, value: string];
}>();
</script>

<template>
	<modal-badge-list>
		<template #title> Filter </template>

		<modal-submenu
			:position-offset="12"
			trigger="hover"
		>
			<template #title>
				Categories
			</template>

			<template #content>
				<market-badge-list v-model="market" title="Categories" />
			</template>
		</modal-submenu>

		<modal-submenu
			:position-offset="12"
			trigger="hover"
		>
			<template #title>
				Editing columns
			</template>

			<template #content>
				<table-columns-settings-component v-model="columns" />
			</template>
		</modal-submenu>

		<modal-submenu>
			<template #title>
				Type
			</template>

			<template #content>
				<modal-badge-list>
					<template v-if="props.filtersValues['status']?.length">
						<modal-item-selector
							v-for="filterValue in props.filtersValues['status']"
							:key="filterValue.value"
							:model-value="filterValue.value === filters.status.selected"
							@click="emits('updateFilter', 'status', filterValue.value)"
						>
							{{filterValue.name}}
						</modal-item-selector>
					</template>

					<!--TODO: add no filters layout-->
					<template v-else>
						No filters found.
					</template>
				</modal-badge-list>
			</template>
		</modal-submenu>
	</modal-badge-list>
</template>
