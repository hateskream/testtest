<script setup lang="ts">
// oxlint-disable-next-line typescript/ban-ts-comment
// @ts-nocheck
import { computed, ref } from 'vue';

import type { IGenericTableColumn, IGenericTableRow, ISortConfig } from '@/modules/table';
import { GenericDataTable } from '@/modules/table';
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IPeerAnalysisData {
	id: string;
	company_name: string;
	company_logo?: string;
	fcf_share: number;
	ltm_revenue: number;
	ev_sales: number;
	pe_ratio: number;
	market_cap?: number;
	sector?: string;
	analyst_rating?: string;
}


const tableColumns = ref<IGenericTableColumn[]>([
	{
		key: 'company',
		label: 'Company',
		position: 0,
		sortable: true,
		draggable: false,
		visible: true,
		type: 'string',
		group: { name: 'basic', displayName: 'Company Info' },
	},
	{
		key: 'fcf_share',
		label: 'FCF/Share',
		position: 1,
		sortable: true,
		draggable: true,
		visible: true,
		width: 120,
		type: 'percent',
		group: { name: 'metrics', displayName: 'Financial Metrics' },
	},
	{
		key: 'ltm_revenue',
		label: 'LTM Revenue',
		position: 2,
		sortable: true,
		draggable: true,
		visible: true,
		width: 140,
		type: 'percent',
		group: { name: 'metrics', displayName: 'Financial Metrics' },
	},
	{
		key: 'ev_sales',
		label: 'EV/Sales',
		position: 3,
		sortable: true,
		draggable: true,
		visible: true,
		width: 120,
		type: 'number',
		group: { name: 'metrics', displayName: 'Financial Metrics' },
	},
	{
		key: 'pe_ratio',
		label: 'P/E',
		position: 4,
		sortable: true,
		draggable: true,
		visible: true,
		width: 100,
		type: 'number',
		group: { name: 'metrics', displayName: 'Financial Metrics' },
	},
]);

// Make allSampleData reactive so deletion triggers updates
const allSampleData = ref<IPeerAnalysisData[]>([
	// Financial Services
	{
		id: 'MS_1',
		company_name: 'Morgan Stanley',
		fcf_share: -1.29,
		ltm_revenue: 14.71,
		ev_sales: 3.5,
		pe_ratio: 12.8,

	},
	{
		id: 'JPM_2',
		company_name: 'JPMorgan Chase & Co',
		fcf_share: 2.45,
		ltm_revenue: 8.93,
		ev_sales: 2.1,
		pe_ratio: 10.2,


	},
	{
		id: 'GS_3',
		company_name: 'Goldman Sachs Group',
		fcf_share: 0.87,
		ltm_revenue: -3.24,
		ev_sales: 1.8,
		pe_ratio: 15.6,


	},
	{
		id: 'BAC_4',
		company_name: 'Bank of America',
		fcf_share: 1.95,
		ltm_revenue: 12.34,
		ev_sales: 2.3,
		pe_ratio: 11.4,

	},
	{
		id: 'WFC_5',
		company_name: 'Wells Fargo',
		fcf_share: 3.12,
		ltm_revenue: 6.78,
		ev_sales: 1.9,
		pe_ratio: 9.8,

	},
	{
		id: 'C_6',
		company_name: 'Citigroup Inc',
		fcf_share: 1.67,
		ltm_revenue: 4.52,
		ev_sales: 1.6,
		pe_ratio: 13.2,
	},
	{
		id: 'SCHW_7',
		company_name: 'Charles Schwab Corporation',
		fcf_share: 2.89,
		ltm_revenue: 15.67,
		ev_sales: 4.2,
		pe_ratio: 18.9,
	},
	{
		id: 'AXP_8',
		company_name: 'American Express Company',
		fcf_share: 4.23,
		ltm_revenue: 9.87,
		ev_sales: 2.8,
		pe_ratio: 14.5,
	},
	{
		id: 'BX_9',
		company_name: 'Blackstone Inc',
		fcf_share: 0.94,
		ltm_revenue: -2.15,
		ev_sales: 6.1,
		pe_ratio: 22.3,
	},
	{
		id: 'KKR_10',
		company_name: 'KKR & Co Inc',
		fcf_share: 1.56,
		ltm_revenue: 11.28,
		ev_sales: 5.7,
		pe_ratio: 19.8,
	},
	{
		id: 'APO_11',
		company_name: 'Apollo Global Management',
		fcf_share: 2.14,
		ltm_revenue: 7.93,
		ev_sales: 4.9,
		pe_ratio: 16.7,
	},
	{
		id: 'BRK_12',
		company_name: 'Berkshire Hathaway Inc',
		fcf_share: 6.78,
		ltm_revenue: 13.45,
		ev_sales: 1.4,
		pe_ratio: 8.9,
	},
	{
		id: 'V_13',
		company_name: 'Visa Inc',
		fcf_share: 8.92,
		ltm_revenue: 18.76,
		ev_sales: 12.3,
		pe_ratio: 28.4,
	},
	{
		id: 'MA_14',
		company_name: 'Mastercard Incorporated',
		fcf_share: 7.45,
		ltm_revenue: 16.23,
		ev_sales: 11.8,
		pe_ratio: 26.1,
	},
	{
		id: 'PYPL_15',
		company_name: 'PayPal Holdings Inc',
		fcf_share: 3.67,
		ltm_revenue: 2.34,
		ev_sales: 3.2,
		pe_ratio: 17.6,
	},
]);

const sortConfig = ref<ISortConfig>({
	columnKey: '',
	direction: 'none',
});


const totalItems = computed(() => allSampleData.value.length);

const convertToTableRows = (peers: IPeerAnalysisData[]): IGenericTableRow[] => {
	return peers.map(peer => ({
		id: peer.id,
		data: {
			...peer,
			company: peer,
		},
		metadata: {
			srcValue: peer.company_logo,
			sector: peer.sector,
			market: 'financial',
		},
	}));
};

const unsortedRows = computed(() => convertToTableRows(allSampleData.value));


const formatPercentage = (value: number) => {
	const sign = value >= 0 ? '+' : '';
	return `${sign}${value.toFixed(2)}%`;
};

const formatRatio = (value: number) => {
	return value.toFixed(1);
};


</script>

<template>
	<chart-common-widget-layout without-padding>
		<template #body>
			<div v-if="totalItems > 0" :class="classes.tableContainer">
				<generic-data-table
					:rows="unsortedRows"
					:columns="tableColumns"
					:sort-config="sortConfig"
					:enable-drag-drop="true"
					:enable-column-reordering="true"
					:enable-sorting="true"
					:enable-column-settings="true"
					:enable-row-actions="false"
					:sticky-header="true"
					:sticky-first-column="true"
				>
					<template #header-company="{ column }">
						<div :class="classes.customHeader">
							<span :class="classes.headerText">{{ column.label }}</span>
						</div>
					</template>

					<template #header-fcf_share="{ column }">
						<div :class="classes.customHeader">
							<span :class="classes.headerText">{{ column.label }}</span>
						</div>
					</template>

					<template #cell-company="{ row }">
						<div :class="classes.companyCell">
							<div :class="classes.companyLogo">
								<ui-icon
									:id="IconIds.BYMA"
									width="20px"
									height="20px"
								/>
							</div>
							<div :class="classes.companyInfo">
								<div :class="classes.companyName">
									{{ row.data.company_name }}
								</div>
								<div v-if="row.data.sector" :class="classes.companySector">
									{{ row.data.sector }}
								</div>
							</div>
						</div>
					</template>

					<template #cell-fcf_share="{ row }">
						<div
							:class="[
								classes.metricCell,
								'text-200-r',
								{
									[classes.positive]: row.data.fcf_share > 0,
									[classes.negative]: row.data.fcf_share < 0,
									[classes.neutral]: row.data.fcf_share === 0
								}
							]"
						>
							{{ formatPercentage(row.data.fcf_share) }}
						</div>
					</template>

					<template #cell-ltm_revenue="{ row }">
						<div
							:class="[
								classes.metricCell,
								{
									[classes.positive]: row.data.ltm_revenue > 0,
									[classes.negative]: row.data.ltm_revenue < 0,
									[classes.neutral]: row.data.ltm_revenue === 0
								}
							]"
						>
							{{ formatPercentage(row.data.ltm_revenue) }}
						</div>
					</template>

					<template #cell-ev_sales="{ row }">
						<div :class="[classes.metricCell, classes.ratioCell]">
							{{ formatRatio(row.data.ev_sales) }}
						</div>
					</template>

					<template #cell-pe_ratio="{ row }">
						<div :class="[classes.metricCell, classes.ratioCell]">
							{{ formatRatio(row.data.pe_ratio) }}
						</div>
					</template>

				</generic-data-table>
			</div>


		</template>

	</chart-common-widget-layout>
</template>

<style module="classes">
.tableContainer {
	overflow: hidden;
	background: var(--bg-color-surface-01, #1a1a1a);
	border-radius: 12px;
}

.customHeader {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 6px;
}

.headerText {
	font-weight: 500;
	font-size: 12px;
}

.companyCell {
	display: flex;
	align-items: center;
	gap: 12px;
	width: 100%;
}

.companyLogo {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 18px;
	height: 18px;
	overflow: hidden;
	border-radius: 50%;
}

.companyInfo {
	flex: 1;
	overflow: hidden;
}

.companyName {
	overflow: hidden;
	font-weight: 500;
	font-size: 14px;
	color: var(--text-color-base-100, #ffffff);
	white-space: nowrap;
	text-overflow: ellipsis;
	cursor: pointer;
}

.companyName:hover {
	text-decoration: underline;
}

.companySector {
	overflow: hidden;
	font-size: 11px;
	color: var(--text-color-base-300, #9a9a9d);
	white-space: nowrap;
	text-overflow: ellipsis;
}

.metricCell {
	font-weight: 500;
	font-size: 13px;
	text-align: right;
	font-variant-numeric: tabular-nums;
}

.metricCell.positive {
	color: #00d4aa;
}

.metricCell.negative {
	color: #ff4d4f;
}

.metricCell.neutral {
	color: var(--text-color-base-300, #9a9a9d);
}

.metricCell.ratioCell {
	color: var(--text-color-base-100, #ffffff);
}

.positive {
	color: #00d4aa;
}

.negative {
	color: #ff4d4f;
}

.neutral {
	color: var(--text-color-base-300, #9a9a9d);
}

.ratioCell {
	color: var(--text-color-base-100, #ffffff);
}
</style>
