<script setup lang="ts">
import { computed } from 'vue';

import { UiPosition } from '@/shared/ui/position';
import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	MarketBadge,
	MarketBadgeList,
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
	ModalSubmenu,
} from '@/modules/widgets/base';
import {
	type FiltersState,
	type FiltersValues,
	type FilterType,
	filterTypeToName,
	filterValueToDisplay,
	type IDisplaySettings,
	type ITicker,
} from '../model';
import type { IMeta } from '@/modules/dashboard-group';
import { type MarketType } from '@/modules/market';
import { IconIds, UiIcon } from '@/shared/ui/icon';

import CellComponent from './cell-component.vue';

interface IViewComponentProps {
	tickers: ITicker[];
	settings: IDisplaySettings;
	meta: IMeta;
	filtersValues: FiltersValues;
	hasPin: boolean;
}

const activeMarket = defineModel<MarketType>('market', { required: true });
const filters = defineModel<FiltersState>('filters', { required: true });

const props = defineProps<IViewComponentProps>();

const emit = defineEmits<{
	(e: 'togglePin', tickerId: string): void;
}>();

const gridTemplateContent = computed(() => {
	const defaultMinWidth = props.meta.size.w > 1 ? 190 : 100;

	let minWidth = defaultMinWidth + ((
		(+(props.settings.isShowChart && props.meta.size.w > 1)) +
		+props.settings.isShowPercentageChange +
		(+(props.settings.isShowLogo && props.meta.size.w > 1)) +
		+props.settings.isShowTicker +
		+props.settings.isShowDescription
	) * 30);


	return `repeat(auto-fit, minmax(${minWidth}px, 1fr)) `;
});

function updateFilter(filterKey: FilterType, filterValue: string) {
	filters.value = {
		...filters.value,
		[filterKey]: filterValue,
	};
}
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.priceHeader">
			<div :class="classes.maximized">
				<market-badge v-model="activeMarket" />

				<div :class="classes.lineDelimiterGroup">
					<ui-delimiter />
				</div>

				<modal-badge
					v-for="(filterState, filterKey) in filters"
					:key="filterKey"
					:class="classes.filter"
				>
					<template #title v-if="filterState">
						{{ filterValueToDisplay[filterState].label }}

						<ui-icon
							:id="IconIds.DropdownDown"
							width="20"
							height="20"
							:class="classes.iconAllFilterColor"
						/>
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
				</modal-badge>
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
		<div :class="classes.scrollable">
			<div :class="classes.content">
				<div
					:class="classes.contentWrapped"
				>
					<cell-component
						v-for="ticker in props.tickers"
						:key="ticker.tickerId"
						:settings="props.settings"
						:ticker="ticker"
						:meta="meta"
						:has-pin="props.hasPin"
						@toggle-pin="emit('togglePin', $event)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.filter {
	margin-left: 6px;
}

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

.scrollable {
	position: relative;
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
}

.flip-list-move {
	transition: transform 0.5s;
}

.content {
	width: 100%;
	height: auto;
}

.contentWrapped {
	display: grid;
	grid-template-columns: v-bind(gridTemplateContent);
	width: 100%;
}

.lineDelimiterGroup {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-left: 6px;
}
</style>
