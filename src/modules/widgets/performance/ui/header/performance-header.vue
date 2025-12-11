<script setup lang="ts">
import { computed } from 'vue';

import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	MarketBadge,
	ModalBadgeDropdown,
	ModalBadgeList,
	ModalItemSelector,
	WidgetFiltersScrollable,
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

const emit = defineEmits<{
	reset: [];
}>();

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
		<widget-filters-scrollable
			:display-variant="displayStyle"
			@on-clear-click="emit('reset')"
		>
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

			<modal-badge-dropdown
				v-if="stock"
				:class="classes.stock"
				:display-variant="displayStyle"
			>
				<template #title>
					{{ stock }}
				</template>

				<template #content>
					<modal-badge-list :display-variant="displayStyle">
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
			</modal-badge-dropdown>

			<modal-badge-dropdown
				v-if="quoteCurrency"
				:class="classes.currency"
				:display-variant="displayStyle"
			>
				<template #title>
					{{ quoteCurrency }}
				</template>

				<template #content>
					<modal-badge-list :display-variant="displayStyle">
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
			</modal-badge-dropdown>

			<modal-badge-dropdown :class="classes.date" :display-variant="displayStyle">
				<template #title>
					{{ date }}
				</template>

				<template #content>
					<modal-badge-list :display-variant="displayStyle">
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
			</modal-badge-dropdown>
		</widget-filters-scrollable>
		<view-toggle v-if="displayStyle === 'default'" v-model:display-variant="displayVariant" />
	</div>
</template>

<style module="classes">
.performanceHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 0 10px 0 0;
	border-bottom: 1px solid var(--border-color-base-100);
	gap: 6px;

	&.default {
		padding-left: 16px;
	}

	&.new {
		padding-left: 0;
	}
}
</style>
