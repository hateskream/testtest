<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { WidgetTypedTable, CellType } from '@/modules/widgets/widget-table';

enum TrendType {
	UP = 'up',
	DOWN = 'down',
	NEUTRAL = 'neutral',
}

const items = [
	{
		id: 'gs',
		data: {
			symbol: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'GS',
				value: 'Goldman Sachs',
			},
			marketValue: {
				value: '183.48',
				currencySymbol: '$',
				magnitude: 'B',
			},
			currentPrice: {
				value: '565.29',
				currencySymbol: '$',
				magnitude: null,
			},
			ytdReturns: {
				value: '-1.26',
				trend: TrendType.UP,
			},
			percentOfFund: {
				value: '6.64',
				magnitude: '%',
			},
		},
	},
	{
		id: 'unh',
		data: {
			symbol: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'UNH',
				value: 'UnitedHealth',
			},
			marketValue: {
				value: '476.99',
				currencySymbol: '$',
				magnitude: 'B',
			},
			currentPrice: {
				value: '516.55',
				currencySymbol: '$',
				magnitude: null,
			},
			ytdReturns: {
				value: '2.11',
				trend: TrendType.UP,
			},
			percentOfFund: {
				value: '6.64',
				magnitude: '%',
			},
		},
	},
	{
		id: 'msft',
		data: {
			symbol: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'MSFT',
				value: 'Microsoft',
			},
			marketValue: {
				value: '2.91',
				currencySymbol: '$',
				magnitude: 'T',
			},
			currentPrice: {
				value: '391.45',
				currencySymbol: '$',
				magnitude: null,
			},
			ytdReturns: {
				value: '-7.13',
				trend: TrendType.DOWN,
			},
			percentOfFund: {
				value: '4.32',
				magnitude: '%',
			},
		},
	},
	{
		id: 'hd',
		data: {
			symbol: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'HD',
				value: 'Home Depot Inc.',
			},
			marketValue: {
				value: '349.46',
				currencySymbol: '$',
				magnitude: 'B',
			},
			currentPrice: {
				value: '351.80',
				currencySymbol: '$',
				magnitude: null,
			},
			ytdReturns: {
				value: '-9.66',
				trend: TrendType.DOWN,
			},
			percentOfFund: {
				value: '2.72',
				magnitude: '%',
			},
		},
	},
	{
		id: 'v',
		data: {
			symbol: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'V',
				value: 'Visa Inc.',
			},
			marketValue: {
				value: '655.20',
				currencySymbol: '$',
				magnitude: 'B',
			},
			currentPrice: {
				value: '335.38',
				currencySymbol: '$',
				magnitude: null,
			},
			ytdReturns: {
				value: '6.12',
				trend: TrendType.UP,
			},
			percentOfFund: {
				value: '2.23',
				magnitude: '%',
			},
		},
	},
	{
		id: 'shw',
		data: {
			symbol: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'SHW',
				value: 'The Sherwin',
			},
			marketValue: {
				value: '83.86',
				currencySymbol: '$',
				magnitude: 'B',
			},
			currentPrice: {
				value: '333.43',
				currencySymbol: '$',
				magnitude: null,
			},
			ytdReturns: {
				value: '-1.91',
				trend: TrendType.DOWN,
			},
			percentOfFund: {
				value: '1.72',
				magnitude: '%',
			},
		},
	},
	{
		id: 'cat',
		data: {
			symbol: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'CAT',
				value: 'Caterpillar Inc.',
			},
			marketValue: {
				value: '160.54',
				currencySymbol: '$',
				magnitude: 'B',
			},
			currentPrice: {
				value: '335.91',
				currencySymbol: '$',
				magnitude: null,
			},
			ytdReturns: {
				value: '-7.40',
				trend: TrendType.DOWN,
			},
			percentOfFund: {
				value: '1.55',
				magnitude: '%',
			},
		},
	},
	{
		id: 'mcd',
		data: {
			symbol: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'MCD',
				value: 'McDonalds',
			},
			marketValue: {
				value: '218.20',
				currencySymbol: '$',
				magnitude: 'B',
			},
			currentPrice: {
				value: '305.40',
				currencySymbol: '$',
				magnitude: null,
			},
			ytdReturns: {
				value: '5.35',
				trend: TrendType.UP,
			},
			percentOfFund: {
				value: '1.32',
				magnitude: '%',
			},
		},
	},
	{
		id: 'amgn',
		data: {
			symbol: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'AMGN',
				value: 'Amgen Inc.',
			},
			marketValue: {
				value: '169.42',
				currencySymbol: '$',
				magnitude: 'B',
			},
			currentPrice: {
				value: '315.82',
				currencySymbol: '$',
				magnitude: null,
			},
			ytdReturns: {
				value: '21.17',
				trend: TrendType.UP,
			},
			percentOfFund: {
				value: '1.14',
				magnitude: '%',
			},
		},
	},
	{
		id: 'axp',
		data: {
			symbol: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'AXP',
				value: 'American Exp...',
			},
			marketValue: {
				value: '189.83',
				currencySymbol: '$',
				magnitude: 'B',
			},
			currentPrice: {
				value: '270.75',
				currencySymbol: '$',
				magnitude: null,
			},
			ytdReturns: {
				value: '-8.77',
				trend: TrendType.DOWN,
			},
			percentOfFund: {
				value: '1.12',
				magnitude: '%',
			},
		},
	},
];

// table columns
const columns = [
	{
		key: 'symbol',
		label: 'Symbol',
		shortLabel: 'Symbol',
		position: 0,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.SYMBOL,
		group: { name: 'Holdings', displayName: 'Holdings' },
	},
	{
		key: 'marketValue',
		label: 'Market Value',
		shortLabel: 'Market Value',
		position: 1,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Holdings', displayName: 'Holdings' },
	},
	{
		key: 'currentPrice',
		label: 'Current Price',
		shortLabel: 'Current Price',
		position: 2,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Holdings', displayName: 'Holdings' },
	},
	{
		key: 'ytdReturns',
		label: 'YTD Returns',
		shortLabel: 'YTD Returns',
		position: 3,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.PERCENT,
		group: { name: 'Holdings', displayName: 'Holdings' },
	},
	{
		key: 'percentOfFund',
		label: '% of Fund',
		shortLabel: '% of Fund',
		position: 4,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Holdings', displayName: 'Holdings' },
	},
];

</script>

<template>
	<chart-common-widget-layout without-padding>
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
