<script setup lang="ts">
import { UiDelimiter } from '@/shared/ui/delimiter';
import { UiPosition } from '@/shared/ui/position';
import { MarketBadge, MarketBadgeList, ModalBadgeList, ModalItemSelector, ModalSubmenu } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type FiltersState, type FiltersValues, FilterType, filterTypeToName } from '../../model';
import { FilterComponent } from '../common';
import type { MarketType } from '@/modules/market';

const emit = defineEmits<{
	reset: [];
}>();

interface IFilterComponentProps {
	filtersValues: FiltersValues;
}

const props = defineProps<IFilterComponentProps>();

const activeMarket = defineModel<MarketType>('market', { required: true });
const filters = defineModel<FiltersState>('filters', { required: true });

function updateFilter(filterKey: FilterType, filterValue: string) {
	filters.value = {
		...filters.value,
		[filterKey]: filterValue,
	};
}
</script>

<template>
	<div :class="classes.priceHeader">
		<div :class="classes.maximized">
			<filter-component
				v-model:market="activeMarket"
				v-model:filters="filters"
				display-type="tv"
				:filters-values="props.filtersValues"
				@reset="emit('reset')"
			/>
		</div>
		<div :class="classes.minimized">
			<market-badge v-model="activeMarket" />
			<ui-delimiter />
			<ui-position :class="[classes.burger, classes.filter]">
				<template #title>
					<ui-icon
						:id="IconIds.Burger"
						width="20px"
						height="20px"
					/>
				</template>
				<template #content>
					<modal-badge-list display-variant="default">
						<modal-submenu>
							<template #title>
								Market
							</template>
							<template #content>
								<market-badge-list
									v-model="activeMarket"
									display-variant="default"
									title="Market"
								/>
							</template>
						</modal-submenu>

						<modal-submenu
							v-for="(filterState, filterKey) in filters"
							:key="filterKey"
						>
							<template #title v-if="filterState">
								{{ filterTypeToName[filterKey] }}
							</template>
							<template #content>
								<modal-badge-list display-variant="default">
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
						</modal-submenu>
					</modal-badge-list>
				</template>
			</ui-position>
		</div>
	</div>
</template>

<style module="classes">
.priceHeader {
	margin-inline: 12px;
	display: flex;
	container: toolbar / inline-size;
}

.maximized {
	display: contents;
}

.minimized {
	display: none;
}

.burger {
	line-height: 0;
	cursor: pointer;
}

@container toolbar (max-width: 200px) {
	.maximized {
		display: none;
	}

	.minimized {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.burger {
		padding: 4px 0;
	}
}
</style>
