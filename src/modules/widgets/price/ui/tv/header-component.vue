<script setup lang="ts">
import { UiDelimiter } from '@/shared/ui/delimiter';
import { UiPosition } from '@/shared/ui/position';
import { MarketBadge, MarketBadgeList, ModalBadgeList, ModalItemSelector, ModalSubmenu } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type MarketType } from '@/modules/market';
import {
	type FiltersState,
	type FiltersValues,
	FilterType,
	filterTypeToName,
	marketTypeToPriceMarketType,
	PriceMarketType,
	priceMarketTypeToMarketType,
} from '../../model';
import { FilterComponent } from '../common';

interface IFilterComponentProps {
	filtersValues: FiltersValues;
}

const props = defineProps<IFilterComponentProps>();

const activeMarket = defineModel<PriceMarketType, string, MarketType, MarketType>('market',
	{
		required: true,
		get: priceMarketTypeToMarketType,
		set: marketTypeToPriceMarketType,
	},
);

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
			/>
		</div>
		<div :class="classes.minimized">
			<market-badge v-model="activeMarket" />

			<div :class="classes.lineDelimiterGroup">
				<ui-delimiter />
			</div>

			<ui-position :class="[classes.burger, classes.filter]">
				<template #title>
					<ui-icon
						:id="IconIds.Burger"
						width="20px"
						height="20px"
					/>
				</template>
				<template #content>
					<modal-badge-list>
						<modal-submenu>
							<template #title>
								Market
							</template>
							<template #content>
								<market-badge-list v-model="activeMarket" title="Market" />
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
		display: contents;
	}

	.burger {
		padding: 4px 0;
	}
}
</style>
