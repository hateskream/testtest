<script setup lang="ts">

import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { WidgetTypedTable, CellType } from '@/modules/widgets/widget-table';

import type { IExtendedTableColumn } from '@/modules/widgets/widget-table/widget-typed-table.vue';

const columns = [
	{
		key: 'date',
		label: 'Date',
		shortLabel: 'Date',
		position: 0,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: {
			name: 'Time',
			displayName: 'Time',
		},
	},
	{
		key: 'type',
		label: 'Type',
		shortLabel: 'Type',
		position: 1,
		sortable: false,
		draggable: true,
		visible: true,
		type: CellType.PLATE,
		group: {
			name: 'Transaction',
			displayName: 'Transaction',
		},
	},
	{
		key: 'usd',
		label: 'USD',
		shortLabel: 'USD',
		position: 2,
		sortable: false,
		draggable: true,
		visible: true,
		type: CellType.NUMBER,
		group: {
			name: 'Amount',
			displayName: 'Amount',
		},
	},
	{
		key: 'btc',
		label: 'BTC',
		shortLabel: 'BTC',
		position: 3,
		sortable: false,
		draggable: true,
		visible: true,
		type: CellType.NUMBER,
		group: {
			name: 'Amount',
			displayName: 'Amount',
		},
	},
	{
		key: 'price',
		label: 'Price',
		shortLabel: 'Price',
		position: 4,
		sortable: false,
		draggable: true,
		visible: true,
		type: CellType.NUMBER,
		group: {
			name: 'Price',
			displayName: 'Price',
		},
	},
] as IExtendedTableColumn[];

const rows = [
	{
		id: 'tx1',
		data: {
			date: { value: '43s ago' },
			type: { value: 'buy' },
			usd: {
				value: '400.15',
				currencySymbol: '$',
				magnitude: null,
			},
			btc: {
				value: '0.00672',
				magnitude: null,
			},
			price: {
				value: '109968.61',
				currencySymbol: '$',
				magnitude: null,
			},
		},
	},
	{
		id: 'tx2',
		data: {
			date: { value: '43s ago' },
			type: { value: 'sell' },
			usd: {
				value: '567.41',
				currencySymbol: '$',
				magnitude: null,
			},
			btc: {
				value: '0.00726',
				magnitude: null,
			},
			price: {
				value: '109968.61',
				currencySymbol: '$',
				magnitude: null,
			},
		},
	},
	{
		id: 'tx3',
		data: {
			date: { value: '43s ago' },
			type: { value: 'buy' },
			usd: {
				value: '309.21',
				currencySymbol: '$',
				magnitude: null,
			},
			btc: {
				value: '0.00456',
				magnitude: null,
			},
			price: {
				value: '109968.61',
				currencySymbol: '$',
				magnitude: null,
			},
		},
	},
	{
		id: 'tx4',
		data: {
			date: { value: '1m 10s ago' },
			type: { value: 'buy' },
			usd: {
				value: '130.61',
				currencySymbol: '$',
				magnitude: null,
			},
			btc: {
				value: '0.00256',
				magnitude: null,
			},
			price: {
				value: '109968.61',
				currencySymbol: '$',
				magnitude: null,
			},
		},
	},
	{
		id: 'tx5',
		data: {
			date: { value: '1m 12s ago' },
			type: { value: 'buy' },
			usd: {
				value: '100.61',
				currencySymbol: '$',
				magnitude: null,
			},
			btc: {
				value: '0.00156',
				magnitude: null,
			},
			price: {
				value: '109968.61',
				currencySymbol: '$',
				magnitude: null,
			},
		},
	},
	{
		id: 'tx6',
		data: {
			date: { value: '1m 15s ago' },
			type: { value: 'sell' },
			usd: {
				value: '177.05',
				currencySymbol: '$',
				magnitude: null,
			},
			btc: {
				value: '0.00356',
				magnitude: null,
			},
			price: {
				value: '109968.61',
				currencySymbol: '$',
				magnitude: null,
			},
		},
	},
];
</script>

<template>
	<chart-common-widget-layout without-padding>
		<template #body>
			<div :class="classes.scrollable">
				<widget-typed-table
					:columns="columns"
					:rows="rows"
					:enable-column-settings="true"
					:enable-column-reordering="true"
					:enable-drag-drop="true"
					:enable-row-actions="false"
					:enable-sorting="true"
					:sticky-first-column="false"
				>
					<template #[`header-date`]>
						<div :class="classes.textAlignRight">Date</div>
					</template>

				</widget-typed-table>
			</div>
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.textAlignRight {
	text-align: right;
}

.scrollable {
	position: relative;
	height: 100%;
	overflow: auto;
}
</style>
