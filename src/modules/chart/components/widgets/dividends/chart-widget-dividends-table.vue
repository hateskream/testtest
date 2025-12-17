<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { CellType, WidgetTypedTable } from '@/modules/widgets/widget-table';
import { UiText } from '@/shared/ui/text';

import type { IExtendedTableColumn } from '@/modules/widgets/widget-table/widget-typed-table.vue';

type TPayoutType = 'cash' | 'stock' | 'special';

const title = 'Dividends & Payouts';

const items = [
	{
		id: 'march-2025',
		data: {
			date: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'March',
				value: 'March',
			},
			payableDate: { value: 'Mar 21, 2025' },
			yield: {
				value: '6.67',
				magnitude: '%',
			},
			payout: {
				value: '0.80072',
				currencySymbol: '$',
				magnitude: null,
			},
			type: { value: 'cash' as TPayoutType },
		},
	},
	{
		id: 'february-2025',
		data: {
			date: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'February',
				value: 'February',
			},
			payableDate: { value: 'Feb 21, 2025' },
			yield: {
				value: '5.49',
				magnitude: '%',
			},
			payout: {
				value: '0.65879',
				currencySymbol: '$',
				magnitude: null,
			},
			type: { value: 'cash' as TPayoutType },
		},
	},
	{
		id: 'january-2025',
		data: {
			date: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'January',
				value: 'January',
			},
			payableDate: { value: 'Jan 17, 2025' },
			yield: {
				value: '1.35',
				magnitude: '%',
			},
			payout: {
				value: '0.16241',
				currencySymbol: '$',
				magnitude: null,
			},
			type: { value: 'cash' as TPayoutType },
		},
	},
	{
		id: 'december-2024',
		data: {
			date: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'December',
				value: 'December',
			},
			payableDate: { value: 'Dec 20, 2024' },
			yield: {
				value: '10.19',
				magnitude: '%',
			},
			payout: {
				value: '1.22269',
				currencySymbol: '$',
				magnitude: null,
			},
			type: { value: 'cash' as TPayoutType },
		},
	},
	{
		id: 'november-2024',
		data: {
			date: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'November',
				value: 'November',
			},
			payableDate: { value: 'Nov 15, 2024' },
			yield: {
				value: '2.29',
				magnitude: '%',
			},
			payout: {
				value: '0.26621',
				currencySymbol: '$',
				magnitude: null,
			},
			type: { value: 'cash' as TPayoutType },
		},
	},
	{
		id: 'october-2024',
		data: {
			date: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'October',
				value: 'October',
			},
			payableDate: { value: 'Oct 18, 2024' },
			yield: {
				value: '4.82',
				magnitude: '%',
			},
			payout: {
				value: '0.55341',
				currencySymbol: '$',
				magnitude: null,
			},
			type: { value: 'cash' as TPayoutType },
		},
	},
	{
		id: 'september-2024',
		data: {
			date: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'September',
				value: 'September',
			},
			payableDate: { value: 'Sep 19, 2024' },
			yield: {
				value: '3.14',
				magnitude: '%',
			},
			payout: {
				value: '0.38752',
				currencySymbol: '$',
				magnitude: null,
			},
			type: { value: 'cash' as TPayoutType },
		},
	},
	{
		id: 'august-2024',
		data: {
			date: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'August',
				value: 'August',
			},
			payableDate: { value: 'Aug 16, 2024' },
			yield: {
				value: '7.23',
				magnitude: '%',
			},
			payout: {
				value: '0.91458',
				currencySymbol: '$',
				magnitude: null,
			},
			type: { value: 'cash' as TPayoutType },
		},
	},
];

// table columns
const columns = [
	{
		key: 'date',
		label: 'Dates',
		shortLabel: 'Dates',
		position: 0,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.SYMBOL,
		group: { name: 'Div', displayName: 'Div' },
	},
	{
		key: 'payableDate',
		label: 'Payable Date',
		shortLabel: 'Payable Date',
		position: 1,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Div', displayName: 'Div' },
	},
	{
		key: 'yield',
		label: 'Yield',
		shortLabel: 'Yield',
		position: 2,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Div', displayName: 'Div' },
	},
	{
		key: 'payout',
		label: 'Payout',
		shortLabel: 'Payout',
		position: 3,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Div', displayName: 'Div' },
	},
	{
		key: 'type',
		label: 'Type',
		shortLabel: 'Type',
		position: 4,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.PLATE,
		group: { name: 'Div', displayName: 'Div' },
	},
] as IExtendedTableColumn[];

</script>

<template>
	<chart-common-widget-layout without-padding>
		<template #header>
			<div :class="classes.header">
				Dividends & Payouts
			</div>
		</template>
		<template #title>
			<div :class="classes.header">
				<ui-text token="title-500">{{ title }}</ui-text>
			</div>
		</template>

		<template #body>
			<widget-typed-table
				:columns="columns"
				:rows="items"
				:enable-column-settings="true"
				:enable-column-reordering="false"
				:enable-drag-drop="false"
				:enable-row-actions="false"
				:enable-sorting="false"
				:sticky-first-column="true"
				:show-header="true"
			/>
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.header {
	display: inline-flex;
	justify-content: space-between;
	width: 100%;
}
</style>
