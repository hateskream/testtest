<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ref, computed } from 'vue';

import type {
	IGenericTableColumn,
	IGenericTableRow,
	ISortConfig,
} from '@/modules/table';
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { GenericDataTable } from '@/modules/table';


interface ITransactionData {
	id: string;
	date: string;
	person_name: string;
	amount: number;
	transaction_type: 'Sale' | 'Purchase';
	person_initial?: string;
}


const tableColumns = ref<IGenericTableColumn[]>([
	{
		key: 'date',
		label: 'Date',
		position: 0,
		sortable: true,
		draggable: false,
		visible: true,
		type: 'string',

		width: 120,
		group: { name: 'basic', displayName: 'Transaction Info' },
	},
	{
		key: 'person',
		label: 'Person',
		position: 1,
		minWidth: 200,
		sortable: true,
		draggable: true,
		visible: true,
		type: 'string',
		group: { name: 'basic', displayName: 'Transaction Info' },
	},
	{
		key: 'amount',
		label: 'Amount',
		position: 2,
		sortable: true,
		draggable: false,
		visible: true,
		width: 140,
		type: 'number',
		group: { name: 'financial', displayName: 'Financial' },
	},
	{
		key: 'transaction_type',
		label: 'Type',
		position: 3,
		sortable: true,
		draggable: false,
		visible: true,
		width: 100,
		type: 'string',
		group: { name: 'basic', displayName: 'Transaction Info' },
	},
]);


const allSampleData = ref<ITransactionData[]>([
	{
		id: 'TXN_1',
		date: '20 Feb, 2024',
		person_name: 'Solomon David M',
		amount: -1500000,
		transaction_type: 'Sale',
		person_initial: 'S',
	},
	{
		id: 'TXN_2',
		date: '22 Feb, 2024',
		person_name: 'Golten Alex S',
		amount: -3310000,
		transaction_type: 'Sale',
		person_initial: 'G',
	},
	{
		id: 'TXN_3',
		date: '25 Feb, 2024',
		person_name: 'Halio Carey',
		amount: -2320000,
		transaction_type: 'Sale',
		person_initial: 'H',
	},
	{
		id: 'TXN_4',
		date: '19 Dec, 2023',
		person_name: 'Ruemmler Kathryn H.',
		amount: -4760000,
		transaction_type: 'Sale',
		person_initial: 'R',
	},
	{
		id: 'TXN_5',
		date: '19 Dec, 2023',
		person_name: 'Halio Carey',
		amount: -965120,
		transaction_type: 'Sale',
		person_initial: 'H',
	},
	{
		id: 'TXN_6',
		date: '19 Dec, 2023',
		person_name: 'Johnson Kevin R',
		amount: 1490000,
		transaction_type: 'Purchase',
		person_initial: 'J',
	},
	{
		id: 'TXN_7',
		date: '15 Dec, 2023',
		person_name: 'Williams Sarah M',
		amount: -2890000,
		transaction_type: 'Sale',
		person_initial: 'W',
	},
	{
		id: 'TXN_8',
		date: '12 Dec, 2023',
		person_name: 'Anderson Mark T',
		amount: 3200000,
		transaction_type: 'Purchase',
		person_initial: 'A',
	},
	{
		id: 'TXN_9',
		date: '10 Dec, 2023',
		person_name: 'Thompson Lisa K',
		amount: -1750000,
		transaction_type: 'Sale',
		person_initial: 'T',
	},
	{
		id: 'TXN_10',
		date: '08 Dec, 2023',
		person_name: 'Martinez Carlos R',
		amount: -980000,
		transaction_type: 'Sale',
		person_initial: 'M',
	},
	{
		id: 'TXN_11',
		date: '05 Dec, 2023',
		person_name: 'Davis Jennifer L',
		amount: 2100000,
		transaction_type: 'Purchase',
		person_initial: 'D',
	},
	{
		id: 'TXN_12',
		date: '03 Dec, 2023',
		person_name: 'Wilson Robert A',
		amount: -1430000,
		transaction_type: 'Sale',
		person_initial: 'W',
	},
	{
		id: 'TXN_13',
		date: '01 Dec, 2023',
		person_name: 'Brown Michelle S',
		amount: -5670000,
		transaction_type: 'Sale',
		person_initial: 'B',
	},
	{
		id: 'TXN_14',
		date: '28 Nov, 2023',
		person_name: 'Garcia Antonio M',
		amount: 890000,
		transaction_type: 'Purchase',
		person_initial: 'G',
	},
	{
		id: 'TXN_15',
		date: '25 Nov, 2023',
		person_name: 'Miller Patricia J',
		amount: -2240000,
		transaction_type: 'Sale',
		person_initial: 'M',
	},
]);

const sortConfig = ref<ISortConfig>({
	columnKey: '',
	direction: 'none',
});


const totalTransactions = computed(() => {
	return allSampleData.value.reduce((sum, transaction) => sum + transaction.amount, 0);
});

const convertToTableRows = (transactions: ITransactionData[]): IGenericTableRow[] => {
	return transactions.map(transaction => ({
		id: transaction.id,
		data: {
			...transaction,
			person: transaction,
			transactionType: transaction.transaction_type,
			amount: transaction.amount,
		},
		metadata: {},
	}));
};


const rowsData = computed(() => convertToTableRows(allSampleData.value));


function formatCurrency(value: number) {
	const sign = value >= 0 ? '+' : '';
	const absValue = Math.abs(value);

	if (absValue >= 1000000) {
		return `${sign}$${(value / 1000000).toFixed(2)}M`;
	} else if (absValue >= 1000) {
		return `${sign}$${(value / 1000).toFixed(0)}K`;
	} else {
		return `${sign}$${value.toFixed(0)}`;
	}
};

const formatDate = (dateStr: string) => {
	return dateStr;
};

</script>

<template>
	<chart-common-widget-layout without-padding>
		<template #header>
			<div :class="classes.transactionsHeader">
				<div class="paragraph-p-01">Recent Activity</div>
				<div
					:class="[
						classes.totalTransactions,
						{
							[classes.negative]: totalTransactions < 0,
							[classes.positive]: totalTransactions > 0
						}
					]"
				>
					{{ formatCurrency(totalTransactions) }} in total transactions
				</div>
			</div>
		</template>
		<template #body>


			<generic-data-table
				:rows="rowsData"
				:columns="tableColumns"
				:sort-config="sortConfig"
				:enable-drag-drop="true"
				:enable-column-reordering="true"
				:enable-sorting="true"
				:enable-column-settings="true"
				:enable-row-actions="false"
				:sticky-header="true"
				:sticky-first-column="true"
				:show-header="false"
			>

				<template #cell-date="{ row }">
					<div :class="classes.dateCell" class="paragraph-p-00">
						{{ formatDate(row.data.date) }}
					</div>
				</template>

				<template #cell-person="{ row }">
					<div :class="classes.personCell" class="paragraph-p-00">
						<div :class="classes.personIcon">
							<div :class="classes.personInitial">
								{{ row.data.person_initial || row.data.person_name.charAt(0) }}
							</div>
						</div>
						<div :class="classes.personInfo">
							<div :class="classes.personName">
								{{ row.data.person_name }}
							</div>
						</div>
					</div>
				</template>

				<template #cell-amount="{ row }">
					<div
						:class="[
							classes.amountCell,
							{
								[classes.positive]: row.data.amount > 0,
								[classes.negative]: row.data.amount < 0,
								[classes.neutral]: row.data.amount === 0
							}
						]"
					>
						{{ formatCurrency(row.data.amount) }}
					</div>
				</template>

				<template #cell-transaction_type="{ row }">
					<div
						:class="[
							classes.typeCell,
							{
								[classes.saleType]: row.data.transaction_type === 'Sale',
								[classes.purchaseType]: row.data.transaction_type === 'Purchase'
							}
						]"
					>
						{{ row.data.transaction_type }}
					</div>
				</template>
			</generic-data-table>

		</template>

	</chart-common-widget-layout>
</template>

<style module="classes">
.transactionsHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: var(--text-color-base-100);
}


.totalTransactions {
	font-weight: 500;
	font-size: 14px;
}

.totalTransactions.negative {
	color: #ff4d4f;
}

.totalTransactions.positive {
	color: #00d4aa;
}


.dateCell {
	color: var(--text-color-base-500);
}

.personCell {
	display: flex;
	align-items: center;
	gap: 8px;
	width: 100%;
}

.personIcon {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	background: var(--bg-color-surface-02);
	border-radius: 50%;
}

.personInitial {
	font-weight: 600;
	font-size: 11px;
	color: var(--text-color-base-100, #ffffff);
}

.personInfo {
	flex: 1;
	overflow: hidden;
}

.personName {
	overflow: hidden;
	font-weight: 400;
	font-size: 14px;
	color: var(--text-color-base-100, #ffffff);
	white-space: nowrap;
	text-overflow: ellipsis;
	cursor: pointer;
}

.personName:hover {
	text-decoration: underline;
}

.amountCell {
	font-weight: 500;
	font-size: 14px;
	text-align: right;
	font-variant-numeric: tabular-nums;
}

.amountCell.positive {
	color: #00d4aa;
}

.amountCell.negative {
	color: #ff4d4f;
}

.amountCell.neutral {
	color: var(--text-color-base-300, #9a9a9d);
}

.typeCell {
	padding: 4px 8px;
	font-weight: 500;
	font-size: 12px;
	text-align: center;
	text-transform: uppercase;
	border-radius: 4px;
}

.typeCell.saleType {
	color: #ff4d4f;
	background: #ff4d4f20;
	border: 1px solid #ff4d4f40;
}

.typeCell.purchaseType {
	color: #00d4aa;
	background: #00d4aa20;
	border: 1px solid #00d4aa40;
}

.negative {
	color: #ff4d4f;
}

.positive {
	color: #00d4aa;
}

.neutral {
	color: var(--text-color-base-300, #9a9a9d);
}

.saleType {
	color: #ff4d4f;
	background: #ff4d4f20;
	border: 1px solid #ff4d4f40;
}

.purchaseType {
	color: #00d4aa;
	background: #00d4aa20;
	border: 1px solid #00d4aa40;
}

/* Empty state styles */
.emptyState {
	padding: 48px 24px;
	text-align: center;
	color: var(--text-color-base-300, #9a9a9d);
	background: var(--bg-color-surface-01, #1a1a1a);
	border-radius: 12px;
}

.emptyState h3 {
	margin-bottom: 8px;
	color: var(--text-color-base-200, #cccccc);
}
</style>
