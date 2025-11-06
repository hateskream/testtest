<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { WidgetTypedTable, CellType } from '@/modules/widgets/widget-table';


import CellStringComponent from '@/modules/widgets/widget-table/cells/cell-string-component.vue';

const items = [
	{
		id: 'number-of-stocks',
		data: {
			characteristic: {
				cellType: 'Text',
				value: 'Number of Stocks',
			},
			dia: {
				value: '31',
			},
			sp500: {
				value: '504',
			},
		},
	},
	{
		id: 'median-market-cap',
		data: {
			characteristic: {
				cellType: 'Text',
				value: 'Median Market Cap',
			},
			dia: {
				value: '650.35B',
			},
			sp500: {
				value: 'N/A',
			},
		},
	},
	{
		id: 'pe-ratio',
		data: {
			characteristic: {
				cellType: 'Text',
				value: 'P/E Ratio',
			},
			dia: {
				value: '23.34',
			},
			sp500: {
				value: 'N/A',
			},
		},
	},
	{
		id: 'pb-ratio',
		data: {
			characteristic: {
				cellType: 'Text',
				value: 'P/B Ratio',
			},
			dia: {
				value: '4.72',
			},
			sp500: {
				value: 'N/A',
			},
		},
	},
	{
		id: 'expense-ratio',
		data: {
			characteristic: {
				cellType: 'Text',
				value: 'Expense Ratio',
			},
			dia: {
				value: '0.16%',
			},
			sp500: {
				value: '0.09%',
			},
		},
	},
	{
		id: 'dividend-yield',
		data: {
			characteristic: {
				cellType: 'Text',
				value: 'Dividend Yield',
			},
			dia: {
				value: '1.6792',
			},
			sp500: {
				value: '1.2921',
			},
		},
	},
	{
		id: 'fund-total-net-assets',
		data: {
			characteristic: {
				cellType: 'Text',
				value: 'Fund total net assets',
			},
			dia: {
				value: '405.83',
			},
			sp500: {
				value: '553.02',
			},
		},
	},
];

// table columns
const columns = [
	{
		key: 'characteristic',
		label: 'Characteristics',
		shortLabel: 'Characteristics',
		position: 0,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Info', displayName: 'Info' },
		minWidth: 100,
		maxWidth: 200,
	},
	{
		key: 'dia',
		label: 'DIA',
		shortLabel: 'DIA',
		position: 1,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Info', displayName: 'Info' },
		minWidth: 100,
		maxWidth: 200,
	},
	{
		key: 'sp500',
		label: 'S&P 500',
		shortLabel: 'S&P 500',
		position: 2,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		minWidth: 100,
		maxWidth: 200,
		group: { name: 'Info', displayName: 'Info' },
	},
];


type TRow = {
	data: {
		characteristic: {
			cellType: string;
			value: string;
		};
	};
};

</script>

<template>
	<chart-common-widget-layout without-padding>
		<template #body>
			<widget-typed-table
				:columns="columns"
				:rows="items"
				:enable-column-settings="false"
				:enable-column-reordering="false"
				:enable-drag-drop="false"
				:enable-row-actions="false"
				:enable-sorting="false"
				:sticky-first-column="false"
				:show-header="true"
			>
				<template #[`cell-characteristic`]="{ row }">
					<cell-string-component :align="`left`" :data="(row as TRow).data.characteristic" />
				</template>
			</widget-typed-table>
		</template>
	</chart-common-widget-layout>
</template>
