<script setup lang="ts">
import { computed } from 'vue';

import { UiDelimiter } from '@/shared/ui/delimiter';
import { MarketBadge, ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import {
	Currency,
	type DateRange,
	DateRangeForex,
	DateRangeStock,
	DisplayVariant,
	getDateLabelByType,
	isDataRangeStock,
	quoteCurrencyFilters,
	Stock,
	stockFilters,
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

const isStockRange = computed(() => isDataRangeStock(date.value));

const dateOptions = computed(() => {
	const values = getDateLabelByType(isStockRange.value);

	return Object.entries(values).map(([value, label]) => ({ value, label }));
});

const dateLabel = computed(() => {
	const values = getDateLabelByType(isStockRange.value);

	if (isStockRange.value) {
		return (values as Record<DateRangeStock, string>)[date.value as DateRangeStock];
	}

	return (values as Record<DateRangeForex, string>)[date.value as DateRangeForex];
});

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
				close-on-select
			/>

			<ui-delimiter v-if="displayStyle === 'default' " />

			<modal-badge-filter
				v-if="stock"
				:display-variant="displayStyle"
				:options="stockFilters"
				:selected-value="stock"
				:label="stock"
				close-on-select
				title="Stock"
				@select="updateStock($event.value)"
			/>

			<modal-badge-filter
				v-if="quoteCurrency"
				:display-variant="displayStyle"
				:options="quoteCurrencyFilters"
				:selected-value="quoteCurrency"
				:label="quoteCurrency"
				close-on-select
				title="Quote currency"
				@select="updateCurrency($event.value)"
			/>

			<modal-badge-filter
				:display-variant="displayStyle"
				:options="dateOptions"
				:selected-value="date"
				:label="dateLabel"
				close-on-select
				title="Date"
				@select="updateDate($event.value)"
			/>
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
