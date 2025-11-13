<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	MarketBadge,
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import {
	Currency,
	type DateRange,
	DisplayVariant,
	getDateLabelByType,
	isDataRangeStock,
	Stock,
	stockToLabel,
} from '../../model';
import { MarketType } from '@/modules/market';

import ViewToggle from './view-toggle.vue';

const stock = defineModel<Stock>('stock');
const date = defineModel<DateRange>('date', { required: true });

const quoteCurrency = defineModel<Currency>('quoteCurrency');

const activeMarket = defineModel<MarketType>('activeMarket', { required: true });
const displayVariant = defineModel<DisplayVariant>('displayVariant', { required: true });
const displayStyle = defineModel<'new' | 'default'>('displayStyle', { required: true });

const dataLabel = computed((): Record<string, string> =>
	getDateLabelByType(isDataRangeStock(date.value)),
);

const dataKeys = computed((): string[] => Object.keys(getDateLabelByType(isDataRangeStock(date.value))));


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
	<div :class="[classes.performanceHeader, classes[displayStyle]]">
		<div :class="classes.listFilters">
			<market-badge
				v-model="activeMarket"
				:exclude-markets="[
					MarketType.Commodities,
					MarketType.Crypto,
					MarketType.Indices
				]"
				:display-variant="displayStyle"
			/>

			<ui-delimiter v-if="displayStyle === 'default' " />

			<modal-badge
				v-if="stock"
				:class="classes.stock"
				:display-variant="displayStyle"
			>
				<template #title>
					{{ stock }}
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

			<modal-badge
				v-if="quoteCurrency"
				:class="classes.currency"
				:display-variant="displayStyle"
			>
				<template #title>
					{{ quoteCurrency }}
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

			<modal-badge :class="classes.date" :display-variant="displayStyle">
				<template #title>
					{{ date }}
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

		</div>
		<view-toggle v-if="displayStyle === 'default'" v-model:display-variant="displayVariant" />
	</div>
</template>

<style module="classes">
.performanceHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px 0 0;
	border-bottom: 1px solid var(--border-color-base-100);
	gap: 6px;
	container: toolbar / inline-size;

	&.default {
		padding-left: 16px;
	}

	&.new {
		padding-left: 0;
	}
}

.listFilters {
	display: flex;
	align-items: center;
	max-width: 100%;
	overflow-x: auto;
	gap: 6px;
}

.icon {
	color: var(--icon-color-base-300);
}


</style>
