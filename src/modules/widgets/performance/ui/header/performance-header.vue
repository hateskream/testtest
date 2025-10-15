<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	MarketBadge,
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
	ModalItemSwitch,
	ModalFilter,
} from '@/modules/widgets/base';
import {
	stockToLabel,
	type DateRange,
	Stock,
	DisplayVariant,
	SymbolDisplayVariant,
	getDateLabelByType,
	isDataRangeStock,
	Currency,
} from '../../model';
import { MarketType } from '@/modules/market';

import PerformanceFilters from '../modals/performance-filters.vue';
import ViewToggle from './view-toggle.vue';

const stock = defineModel<Stock>('stock');
const date = defineModel<DateRange>('date', { required: true });
const symbolDisplayVariant = defineModel<SymbolDisplayVariant>('symbolDisplay');
const quoteCurrency = defineModel<Currency>('quoteCurrency');

const activeMarket = defineModel<MarketType>('activeMarket', { required: true });
const displayVariant = defineModel<DisplayVariant>('displayVariant', { required: true });
const isCompactMode = defineModel<boolean>('isCompactMode', { required: true });

const dataLabel = computed((): Record<string, string> =>
	getDateLabelByType(isDataRangeStock(date.value)),
);

const dataKeys = computed((): string[] => Object.keys(getDateLabelByType(isDataRangeStock(date.value))));

const iconCurrentModeVariant = computed((): IconIds => isCompactMode.value ? IconIds.ToFull : IconIds.ToCompact);

function updateStock(s: Stock) {
	stock.value = s;
}

function updateDate(v: string) {
	date.value = v as DateRange;
}

function updateCurrency(v: Currency) {
	quoteCurrency.value = v;
}
</script>

<template>
	<div :class="classes.performanceHeader">
		<div :class="classes.listFilters">
			<ui-position  :class="classes.iconAllFilter">
				<template #title>
					<ui-icon
						:id="IconIds.NewsFilter"
						width="20"
						height="20"
						:class="classes.icon"
					/>
				</template>

				<template #content>
					<modal-filter>
						<template #content>
							<performance-filters
								v-model:active-market="activeMarket"
								v-model:is-compact-mode="isCompactMode"
								v-model:display-variant="displayVariant"
								v-model:stock="stock"
								v-model:date="date"
								v-model:symbol-display="symbolDisplayVariant"
								v-model:quote-currency="quoteCurrency"
							/>
						</template>
					</modal-filter>
				</template>
			</ui-position>

			<ui-delimiter />

			<market-badge
				v-model="activeMarket"
				:exclude-markets="[
					MarketType.Commodities,
					MarketType.Crypto,
					MarketType.Indices
				]"
			/>

			<modal-badge v-if="stock">
				<template #title>
					{{stock}}
					<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>Stock</template>

						<template v-for="s in Stock" :key="s">
							<modal-item-selector
								:model-value="s === stock"
								@update:model-value="updateStock(s)"
							>
								{{ stockToLabel[s] }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge v-if="quoteCurrency">
				<template #title>
					{{quoteCurrency}}
					<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>Quote currency</template>

						<template v-for="c in Currency" :key="c">
							<modal-item-selector
								:model-value="c === quoteCurrency"
								@update:model-value="updateCurrency(c)"
							>
								{{ c }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge>
				<template #title>
					{{date}}
					<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>Date</template>

						<template v-for="r in dataKeys" :key="r">
							<modal-item-selector
								:model-value="r === date"
								@update:model-value="updateDate(r)"
							>
								{{ dataLabel[r] }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge padding-left="2px">
				<template #title>
					<div :class="classes.mode">
						<ui-icon
							:id="iconCurrentModeVariant"
							width="14"
							height="14"
						/>
					</div>

					<ui-icon :id="IconIds.DropdownDown" :class="classes.icon" />
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>Settings</template>

						<modal-item-switch v-model="isCompactMode">
							Compact mode
						</modal-item-switch>
					</modal-badge-list>
				</template>
			</modal-badge>
		</div>
		<view-toggle v-model:display-variant="displayVariant" />
	</div>
</template>

<style module="classes">
.performanceHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px 0 16px;
	border-bottom: 1px solid var(--border-color-base-100);
	gap: 6px;
}

.listFilters {
	display: flex;
	align-items: center;
	max-width: 100%;
	overflow-x: auto;
	gap: 6px;
}

.iconAllFilter {
	cursor: pointer;
}

.icon {
	color: var(--icon-color-base-300);
}

.mode {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 28px;
	height: 28px;
	border: 0.5px solid var(--color-border-surface-02, rgb(199 199 199 / 10%));
	border-radius: var(--radius-full, 9999px);
	backdrop-filter: blur(5px);
}
</style>
