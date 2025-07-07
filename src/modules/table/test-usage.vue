<script setup lang="ts">
import { ref, computed } from 'vue';

import type {
	IGenericTableColumn,
	IGenericTableSection,
	IGenericTableRow,
	ISortConfig,
	IDragDropEvent,
} from './type';

import GenericDataTable from './components/generic-data-table.vue';

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

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);

// Delete tracking (optional - for showing feedback)
const recentlyDeleted = ref<string[]>([]);
const deleteMessage = ref<string>('');

const tableColumns = ref<IGenericTableColumn[]>([
	{
		key: 'company',
		label: 'Company',
		position: 0,
		sortable: true,
		draggable: false,
		visible: true,
		width: 200,
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
		sector: 'Financial Services',
	},
	{
		id: 'JPM_2',
		company_name: 'JPMorgan Chase & Co',
		fcf_share: 2.45,
		ltm_revenue: 8.93,
		ev_sales: 2.1,
		pe_ratio: 10.2,
		sector: 'Financial Services',
	},
	{
		id: 'GS_3',
		company_name: 'Goldman Sachs Group',
		fcf_share: 0.87,
		ltm_revenue: -3.24,
		ev_sales: 1.8,
		pe_ratio: 15.6,
		sector: 'Financial Services',
	},
	{
		id: 'BAC_4',
		company_name: 'Bank of America',
		fcf_share: 1.95,
		ltm_revenue: 12.34,
		ev_sales: 2.3,
		pe_ratio: 11.4,
		sector: 'Financial Services',
	},
	{
		id: 'WFC_5',
		company_name: 'Wells Fargo',
		fcf_share: 3.12,
		ltm_revenue: 6.78,
		ev_sales: 1.9,
		pe_ratio: 9.8,
		sector: 'Financial Services',
	},

	// Technology
	{
		id: 'AAPL_6',
		company_name: 'Apple Inc',
		fcf_share: 8.95,
		ltm_revenue: 24.67,
		ev_sales: 7.2,
		pe_ratio: 28.4,
		sector: 'Technology',
	},
	{
		id: 'MSFT_7',
		company_name: 'Microsoft Corporation',
		fcf_share: 7.23,
		ltm_revenue: 18.93,
		ev_sales: 12.1,
		pe_ratio: 32.1,
		sector: 'Technology',
	},
	{
		id: 'GOOGL_8',
		company_name: 'Alphabet Inc',
		fcf_share: 6.78,
		ltm_revenue: 15.42,
		ev_sales: 5.8,
		pe_ratio: 22.7,
		sector: 'Technology',
	},
	{
		id: 'META_9',
		company_name: 'Meta Platforms',
		fcf_share: 12.34,
		ltm_revenue: 22.87,
		ev_sales: 6.9,
		pe_ratio: 18.9,
		sector: 'Technology',
	},
	{
		id: 'AMZN_10',
		company_name: 'Amazon.com Inc',
		fcf_share: 4.56,
		ltm_revenue: 38.91,
		ev_sales: 2.8,
		pe_ratio: 45.2,
		sector: 'Technology',
	},
	{
		id: 'NVDA_11',
		company_name: 'NVIDIA Corporation',
		fcf_share: 15.67,
		ltm_revenue: 126.84,
		ev_sales: 22.1,
		pe_ratio: 67.8,
		sector: 'Technology',
	},
	{
		id: 'ORCL_12',
		company_name: 'Oracle Corporation',
		fcf_share: 5.43,
		ltm_revenue: 11.23,
		ev_sales: 8.7,
		pe_ratio: 24.5,
		sector: 'Technology',
	},

	// Healthcare
	{
		id: 'JNJ_13',
		company_name: 'Johnson & Johnson',
		fcf_share: 6.78,
		ltm_revenue: 3.45,
		ev_sales: 4.7,
		pe_ratio: 16.8,
		sector: 'Healthcare',
	},
	{
		id: 'PFE_14',
		company_name: 'Pfizer Inc',
		fcf_share: 8.92,
		ltm_revenue: -12.34,
		ev_sales: 3.2,
		pe_ratio: 13.6,
		sector: 'Healthcare',
	},
	{
		id: 'UNH_15',
		company_name: 'UnitedHealth Group',
		fcf_share: 9.87,
		ltm_revenue: 14.56,
		ev_sales: 1.8,
		pe_ratio: 21.3,
		sector: 'Healthcare',
	},
	{
		id: 'ABT_16',
		company_name: 'Abbott Laboratories',
		fcf_share: 4.23,
		ltm_revenue: 2.89,
		ev_sales: 5.1,
		pe_ratio: 18.7,
		sector: 'Healthcare',
	},
	{
		id: 'TMO_17',
		company_name: 'Thermo Fisher Scientific',
		fcf_share: 7.65,
		ltm_revenue: 8.91,
		ev_sales: 6.8,
		pe_ratio: 22.4,
		sector: 'Healthcare',
	},

	// Energy
	{
		id: 'XOM_18',
		company_name: 'Exxon Mobil Corporation',
		fcf_share: 15.67,
		ltm_revenue: 89.23,
		ev_sales: 1.1,
		pe_ratio: 8.7,
		sector: 'Energy',
	},
	{
		id: 'CVX_19',
		company_name: 'Chevron Corporation',
		fcf_share: 12.34,
		ltm_revenue: 45.67,
		ev_sales: 1.3,
		pe_ratio: 9.2,
		sector: 'Energy',
	},
	{
		id: 'COP_20',
		company_name: 'ConocoPhillips',
		fcf_share: 18.91,
		ltm_revenue: 67.43,
		ev_sales: 1.5,
		pe_ratio: 7.8,
		sector: 'Energy',
	},
	{
		id: 'SLB_21',
		company_name: 'Schlumberger',
		fcf_share: 6.78,
		ltm_revenue: 23.45,
		ev_sales: 2.1,
		pe_ratio: 11.6,
		sector: 'Energy',
	},

	// Consumer Staples
	{
		id: 'WMT_22',
		company_name: 'Walmart Inc',
		fcf_share: 3.89,
		ltm_revenue: 4.56,
		ev_sales: 0.8,
		pe_ratio: 24.1,
		sector: 'Consumer Staples',
	},
	{
		id: 'PG_23',
		company_name: 'Procter & Gamble',
		fcf_share: 5.67,
		ltm_revenue: 6.78,
		ev_sales: 4.9,
		pe_ratio: 26.3,
		sector: 'Consumer Staples',
	},
	{
		id: 'KO_24',
		company_name: 'The Coca-Cola Company',
		fcf_share: 4.23,
		ltm_revenue: 8.91,
		ev_sales: 6.2,
		pe_ratio: 23.7,
		sector: 'Consumer Staples',
	},
	{
		id: 'PEP_25',
		company_name: 'PepsiCo Inc',
		fcf_share: 6.45,
		ltm_revenue: 7.34,
		ev_sales: 3.1,
		pe_ratio: 25.8,
		sector: 'Consumer Staples',
	},

	// Automotive
	{
		id: 'TSLA_26',
		company_name: 'Tesla Inc',
		fcf_share: 4.32,
		ltm_revenue: 47.89,
		ev_sales: 8.9,
		pe_ratio: 52.3,
		sector: 'Automotive',
	},
	{
		id: 'F_27',
		company_name: 'Ford Motor Company',
		fcf_share: -2.34,
		ltm_revenue: 12.67,
		ev_sales: 0.4,
		pe_ratio: 8.9,
		sector: 'Automotive',
	},
	{
		id: 'GM_28',
		company_name: 'General Motors',
		fcf_share: 1.89,
		ltm_revenue: 9.87,
		ev_sales: 0.6,
		pe_ratio: 7.2,
		sector: 'Automotive',
	},

	// Industrial
	{
		id: 'GE_29',
		company_name: 'General Electric',
		fcf_share: 3.45,
		ltm_revenue: 15.23,
		ev_sales: 1.8,
		pe_ratio: 14.6,
		sector: 'Industrial',
	},
	{
		id: 'CAT_30',
		company_name: 'Caterpillar Inc',
		fcf_share: 8.76,
		ltm_revenue: 23.45,
		ev_sales: 2.1,
		pe_ratio: 12.8,
		sector: 'Industrial',
	},
	{
		id: 'BA_31',
		company_name: 'Boeing Company',
		fcf_share: -5.67,
		ltm_revenue: -8.91,
		ev_sales: 1.4,
		pe_ratio: -12.3,
		sector: 'Industrial',
	},
	{
		id: 'HON_32',
		company_name: 'Honeywell International',
		fcf_share: 6.78,
		ltm_revenue: 11.34,
		ev_sales: 3.2,
		pe_ratio: 19.7,
		sector: 'Industrial',
	},

	// Retail
	{
		id: 'HD_33',
		company_name: 'Home Depot Inc',
		fcf_share: 9.87,
		ltm_revenue: 8.23,
		ev_sales: 2.8,
		pe_ratio: 22.1,
		sector: 'Retail',
	},
	{
		id: 'COST_34',
		company_name: 'Costco Wholesale',
		fcf_share: 7.45,
		ltm_revenue: 6.78,
		ev_sales: 1.1,
		pe_ratio: 34.5,
		sector: 'Retail',
	},
	{
		id: 'TGT_35',
		company_name: 'Target Corporation',
		fcf_share: 5.23,
		ltm_revenue: 2.89,
		ev_sales: 0.7,
		pe_ratio: 16.8,
		sector: 'Retail',
	},

	// Telecommunications
	{
		id: 'VZ_36',
		company_name: 'Verizon Communications',
		fcf_share: 4.56,
		ltm_revenue: -1.23,
		ev_sales: 1.6,
		pe_ratio: 8.9,
		sector: 'Telecommunications',
	},
	{
		id: 'T_37',
		company_name: 'AT&T Inc',
		fcf_share: 3.78,
		ltm_revenue: -2.45,
		ev_sales: 0.9,
		pe_ratio: 7.2,
		sector: 'Telecommunications',
	},

	// Media & Entertainment
	{
		id: 'DIS_38',
		company_name: 'Walt Disney Company',
		fcf_share: 2.34,
		ltm_revenue: 12.67,
		ev_sales: 2.1,
		pe_ratio: 28.4,
		sector: 'Media & Entertainment',
	},
	{
		id: 'NFLX_39',
		company_name: 'Netflix Inc',
		fcf_share: 8.91,
		ltm_revenue: 14.56,
		ev_sales: 4.7,
		pe_ratio: 35.2,
		sector: 'Media & Entertainment',
	},

	// Real Estate
	{
		id: 'AMT_40',
		company_name: 'American Tower Corp',
		fcf_share: 6.78,
		ltm_revenue: 7.89,
		ev_sales: 11.2,
		pe_ratio: 28.6,
		sector: 'Real Estate',
	},
	{
		id: 'PLD_41',
		company_name: 'Prologis Inc',
		fcf_share: 4.23,
		ltm_revenue: 9.45,
		ev_sales: 8.7,
		pe_ratio: 32.1,
		sector: 'Real Estate',
	},

	// Utilities
	{
		id: 'NEE_42',
		company_name: 'NextEra Energy',
		fcf_share: 5.67,
		ltm_revenue: 8.34,
		ev_sales: 3.2,
		pe_ratio: 21.8,
		sector: 'Utilities',
	},
	{
		id: 'SO_43',
		company_name: 'Southern Company',
		fcf_share: 4.89,
		ltm_revenue: 6.23,
		ev_sales: 2.1,
		pe_ratio: 18.9,
		sector: 'Utilities',
	},

	// Materials
	{
		id: 'LIN_44',
		company_name: 'Linde plc',
		fcf_share: 7.89,
		ltm_revenue: 11.45,
		ev_sales: 4.8,
		pe_ratio: 24.3,
		sector: 'Materials',
	},
	{
		id: 'APD_45',
		company_name: 'Air Products & Chemicals',
		fcf_share: 6.34,
		ltm_revenue: 9.67,
		ev_sales: 5.2,
		pe_ratio: 26.7,
		sector: 'Materials',
	},
]);

const sortConfig = ref<ISortConfig>({
	columnKey: '',
	direction: 'none',
});

// Computed properties for pagination (these automatically update when data changes)
const totalItems = computed(() => allSampleData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

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

// Get paginated data
const getPaginatedData = () => {
	const startIndex = (currentPage.value - 1) * pageSize.value;
	const endIndex = startIndex + pageSize.value;
	return allSampleData.value.slice(startIndex, endIndex);
};

// Group paginated data by sector and split between sections and unsorted
const getPaginatedSectionsAndUnsorted = () => {
	const paginatedData = getPaginatedData();
	const allRows = convertToTableRows(paginatedData);

	// Split rows: first 70% go to sections, rest go to unsorted
	const splitIndex = Math.floor(allRows.length * 0.7);
	const sectionRows = allRows.slice(0, splitIndex);
	const unsortedRowsData = allRows.slice(splitIndex);

	// Group section rows by sector
	const sectorGroups = sectionRows.reduce((acc, row) => {
		const sector = row.data.sector || 'Other';
		if (!acc[sector]) {
			acc[sector] = [];
		}
		acc[sector].push(row);
		return acc;
	}, {} as Record<string, IGenericTableRow[]>);

	// Convert to sections
	const sections = Object.entries(sectorGroups).map(([sector, rows]) => ({
		id: sector.toLowerCase().replace(/\s+/g, '-'),
		title: sector,
		isCollapsed: false,
		rows: rows,
	}));

	return { sections, unsortedRows: unsortedRowsData };
};

const paginatedData = computed(() => getPaginatedSectionsAndUnsorted());
const tableSections = computed(() => paginatedData.value.sections);
const unsortedRows = computed(() => paginatedData.value.unsortedRows);

// Handle pagination edge cases after deletion
const handlePaginationAfterDeletion = () => {
	// If current page is now empty and not the first page, go to previous page
	if (currentPage.value > 1 && getPaginatedData().length === 0) {
		currentPage.value = Math.max(1, currentPage.value - 1);
	}

	// If we're beyond the total pages, go to the last available page
	if (currentPage.value > totalPages.value && totalPages.value > 0) {
		currentPage.value = totalPages.value;
	}

	// If no data left, reset to page 1
	if (totalItems.value === 0) {
		currentPage.value = 1;
	}
};

// Enhanced delete handler that updates pagination
const handleRowDeleted = (payload: { rowId: string; sectionId: string }) => {
	const index = allSampleData.value.findIndex(item => item.id === payload.rowId);

	if (index > -1) {
		// Remove the item from the data array
		const deletedItem = allSampleData.value.splice(index, 1)[0];

		// Show feedback message
		deleteMessage.value = `${deletedItem.company_name} has been deleted`;
		recentlyDeleted.value.push(deletedItem.company_name);

		// Clear message after 3 seconds
		setTimeout(() => {
			deleteMessage.value = '';
		}, 3000);

		// Handle pagination edge cases
		handlePaginationAfterDeletion();

		console.log(`Row ${payload.rowId} (${deletedItem.company_name}) deleted from ${payload.sectionId}`);
		console.log(`Total items remaining: ${totalItems.value}, Current page: ${currentPage.value}/${totalPages.value}`);
	} else {
		console.warn(`Could not find item with id: ${payload.rowId}`);
	}
};

// Optional: Bulk delete functionality
const handleBulkDelete = (rowIds: string[]) => {
	const deletedCompanies: string[] = [];

	// Remove all items with matching IDs (iterate backwards to avoid index issues)
	for (let i = allSampleData.value.length - 1; i >= 0; i--) {
		if (rowIds.includes(allSampleData.value[i].id)) {
			const deletedItem = allSampleData.value.splice(i, 1)[0];
			deletedCompanies.push(deletedItem.company_name);
		}
	}

	if (deletedCompanies.length > 0) {
		deleteMessage.value = `${deletedCompanies.length} companies deleted: ${deletedCompanies.join(', ')}`;
		recentlyDeleted.value.push(...deletedCompanies);

		setTimeout(() => {
			deleteMessage.value = '';
		}, 4000);

		handlePaginationAfterDeletion();
		console.log(`${deletedCompanies.length} items deleted`);
	}
};

const formatPercentage = (value: number) => {
	const sign = value >= 0 ? '+' : '';
	return `${sign}${value.toFixed(2)}%`;
};

const formatRatio = (value: number) => {
	return value.toFixed(1);
};

const openCompanyDetails = (companyId: string, companyName: string) => {
	console.log('Open company details:', { companyId, companyName });
};

const handleColumnsUpdate = (columns: IGenericTableColumn[]) => {
	tableColumns.value = [...columns];
};

const handleSectionsUpdate = (sections: IGenericTableSection[]) => {
	// Note: For pagination, we don't want to persist section changes
	// as they will be overwritten on page change
	console.log('Sections updated:', sections);
};

const handleUnsortedRowsUpdate = (rows: IGenericTableRow[]) => {
	// Note: For pagination, changes to unsorted rows are temporary
	console.log('Unsorted rows updated:', rows);
};

const handleSortConfigUpdate = (config: ISortConfig) => {
	sortConfig.value = { ...config };
};

const handleRowMoved = (payload: IDragDropEvent) => {
	console.log('Row moved:', payload);
};

// Pagination handlers
const goToPage = (page: number) => {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page;
	}
};

const goToPreviousPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};

const goToNextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
	}
};

const changePageSize = (newSize: number) => {
	pageSize.value = newSize;
	currentPage.value = 1; // Reset to first page when changing page size
};

// Calculate visible page numbers for pagination
const getVisiblePages = () => {
	const pages = [];
	const delta = 2; // Number of pages to show on each side of current page

	for (let i = Math.max(1, currentPage.value - delta);
		i <= Math.min(totalPages.value, currentPage.value + delta);
		i++) {
		pages.push(i);
	}

	return pages;
};

// Calculate displayed range (this automatically updates as data changes)
const displayedRange = computed(() => {
	if (totalItems.value === 0) {
		return { start: 0, end: 0 };
	}
	const start = (currentPage.value - 1) * pageSize.value + 1;
	const end = Math.min(currentPage.value * pageSize.value, totalItems.value);
	return { start, end };
});
</script>

<template>
	<div class="peer-analysis-page">
		<div class="page-header">
			<h1>Peer Analysis with Delete & Pagination</h1>
			<p class="page-subtitle">
				<span v-if="totalItems > 0">
					Showing {{ displayedRange.start }}-{{ displayedRange.end }} of {{ totalItems }} companies
				</span>
				<span v-else class="empty-text">
					No companies to display
				</span>
			</p>

			<!-- Delete feedback message -->
			<div v-if="deleteMessage" class="delete-message">
				{{ deleteMessage }}
			</div>
		</div>

		<div v-if="totalItems > 0" class="table-container">
			<generic-data-table
				:sections="tableSections"
				:unsorted-rows="unsortedRows"
				:columns="tableColumns"
				:sort-config="sortConfig"
				:enable-drag-drop="true"
				:enable-column-reordering="true"
				:enable-sorting="true"
				:enable-column-settings="true"
				:enable-row-actions="true"
				:sticky-header="true"
				:sticky-first-column="true"
				@update:columns="handleColumnsUpdate"
				@update:sections="handleSectionsUpdate"
				@update:unsorted-rows="handleUnsortedRowsUpdate"
				@update:sort-config="handleSortConfigUpdate"
				@row-moved="handleRowMoved"
				@row-deleted="handleRowDeleted"
			>
				<template #header-company="{ column }">
					<div class="custom-header">
						<span class="header-icon">🏢</span>
						<span class="header-text">{{ column.label }}</span>
					</div>
				</template>

				<template #header-fcf_share="{ column }">
					<div class="custom-header">
						<span class="header-icon">💰</span>
						<span class="header-text">{{ column.label }}</span>
					</div>
				</template>

				<template #cell-company="{ row }">
					<div class="company-cell">
						<div class="company-logo">
							<div class="logo-placeholder">
								{{ row.data.company_name.substring(0, 2) }}
							</div>
						</div>
						<div class="company-info">
							<div
								class="company-name"
								@click="openCompanyDetails(row.data.id, row.data.company_name)"
							>
								{{ row.data.company_name }}
							</div>
							<div v-if="row.data.sector" class="company-sector">
								{{ row.data.sector }}
							</div>
						</div>
					</div>
				</template>

				<template #cell-fcf_share="{ row }">
					<div
						class="metric-cell"
						:class="{
							'positive': row.data.fcf_share > 0,
							'negative': row.data.fcf_share < 0,
							'neutral': row.data.fcf_share === 0
						}"
					>
						{{ formatPercentage(row.data.fcf_share) }}
					</div>
				</template>

				<template #cell-ltm_revenue="{ row }">
					<div
						class="metric-cell"
						:class="{
							'positive': row.data.ltm_revenue > 0,
							'negative': row.data.ltm_revenue < 0,
							'neutral': row.data.ltm_revenue === 0
						}"
					>
						{{ formatPercentage(row.data.ltm_revenue) }}
					</div>
				</template>

				<template #cell-ev_sales="{ row }">
					<div class="metric-cell ratio-cell">
						{{ formatRatio(row.data.ev_sales) }}
					</div>
				</template>

				<template #cell-pe_ratio="{ row }">
					<div class="metric-cell ratio-cell">
						{{ formatRatio(row.data.pe_ratio) }}
					</div>
				</template>

				<template #pagination>
					<div>ЗДЕСЬ КНОПКИ</div>
					<div class="pagination-container">
						<div class="pagination-info">
							<span class="pagination-text">
								<span v-if="totalItems > 0">
									Showing {{ displayedRange.start }}-{{ displayedRange.end }}
									of {{ totalItems }} companies
								</span>
								<span v-else>
									No companies available
								</span>
							</span>

							<div v-if="totalItems > 0" class="page-size-selector">
								<label class="page-size-label">Rows per page:</label>
								<select
									:value="pageSize"
									class="page-size-select"
									@change="changePageSize(Number($event.target.value))"
								>
									<option value="5">5</option>
									<option value="10">10</option>
									<option value="15">15</option>
									<option value="25">25</option>
									<option value="50">50</option>
								</select>
							</div>
						</div>

						<div v-if="totalPages > 1" class="pagination-controls">
							<button
								class="pagination-btn"
								:disabled="currentPage === 1"
								@click="goToPreviousPage"
							>
								<span class="pagination-icon">‹</span>
								Previous
							</button>

							<div class="page-numbers">
								<!-- First page -->
								<button
									v-if="getVisiblePages()[0] > 1"
									class="page-btn"
									@click="goToPage(1)"
								>
									1
								</button>

								<!-- Ellipsis before current range -->
								<span v-if="getVisiblePages()[0] > 2" class="pagination-ellipsis">...</span>

								<!-- Visible page range -->
								<button
									v-for="page in getVisiblePages()"
									:key="page"
									class="page-btn"
									:class="{ 'active': page === currentPage }"
									@click="goToPage(page)"
								>
									{{ page }}
								</button>

								<!-- Ellipsis after current range -->
								<span v-if="getVisiblePages().slice(-1)[0] < totalPages - 1" class="pagination-ellipsis">...</span>

								<!-- Last page -->
								<button
									v-if="getVisiblePages().slice(-1)[0] < totalPages"
									class="page-btn"
									@click="goToPage(totalPages)"
								>
									{{ totalPages }}
								</button>
							</div>

							<button
								class="pagination-btn"
								:disabled="currentPage === totalPages"
								@click="goToNextPage"
							>
								Next
								<span class="pagination-icon">›</span>
							</button>
						</div>
					</div>
				</template>
			</generic-data-table>
		</div>

		<!-- Empty state when no data -->
		<div v-else class="empty-state">
			<h3>No Companies Available</h3>
			<p>All companies have been deleted or there are no companies to display.</p>
		</div>
	</div>
</template>

<style scoped>
.peer-analysis-page {
	max-width: 1200px;
	padding: 24px;
}

.page-header h1 {
	margin-bottom: 4px;
	color: var(--text-color-base-100, #ffffff);
}

.page-subtitle {
	margin-bottom: 16px;
	font-size: 14px;
	color: var(--text-color-base-300, #9a9a9d);
}

.empty-text {
	font-style: italic;
	color: var(--text-color-base-300, #9a9a9d);
}

.delete-message {
	margin-bottom: 16px;
	padding: 8px 16px;
	font-size: 14px;
	color: #00d4aa;
	background: #00d4aa20;
	border: 1px solid #00d4aa40;
	border-radius: 6px;
	animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
	from {
		transform: translateY(-10px);
		opacity: 0;
	}

	to {
		transform: translateY(0);
		opacity: 1;
	}
}

.table-container {
	overflow: hidden;
	background: var(--bg-color-surface-01, #1a1a1a);
	border-radius: 12px;
}

.custom-header {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 6px;
}

.header-icon {
	font-size: 14px;
}

.header-text {
	font-weight: 500;
	font-size: 12px;
}

.company-cell {
	display: flex;
	align-items: center;
	gap: 12px;
	width: 100%;
}

.company-logo {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	overflow: hidden;
	background: var(--bg-color-base-300, #333333);
	border-radius: 50%;
}

.logo-placeholder {
	font-weight: 600;
	font-size: 12px;
	color: var(--text-color-base-100, #ffffff);
}

.company-info {
	flex: 1;
	overflow: hidden;
}

.company-name {
	overflow: hidden;
	font-weight: 500;
	font-size: 14px;
	color: var(--text-color-base-100, #ffffff);
	white-space: nowrap;
	text-overflow: ellipsis;
	cursor: pointer;
}

.company-name:hover {
	text-decoration: underline;
}

.company-sector {
	overflow: hidden;
	font-size: 11px;
	color: var(--text-color-base-300, #9a9a9d);
	white-space: nowrap;
	text-overflow: ellipsis;
}

.metric-cell {
	font-weight: 500;
	font-size: 13px;
	text-align: right;
	font-variant-numeric: tabular-nums;
}

.metric-cell.positive {
	color: #00d4aa;
}

.metric-cell.negative {
	color: #ff4d4f;
}

.metric-cell.neutral {
	color: var(--text-color-base-300, #9a9a9d);
}

.metric-cell.ratio-cell {
	color: var(--text-color-base-100, #ffffff);
}

/* Empty state styles */
.empty-state {
	padding: 48px 24px;
	text-align: center;
	color: var(--text-color-base-300, #9a9a9d);
	background: var(--bg-color-surface-01, #1a1a1a);
	border-radius: 12px;
}

.empty-state h3 {
	margin-bottom: 8px;
	color: var(--text-color-base-200, #cccccc);
}

/* Pagination Styles */
.pagination-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 24px;
	background: var(--bg-color-surface-01, #1a1a1a);
	border-top: 1px solid var(--border-color-base-200, #333333);
}

.pagination-info {
	display: flex;
	align-items: center;
	gap: 24px;
}

.pagination-text {
	font-size: 13px;
	color: var(--text-color-base-300, #9a9a9d);
	font-variant-numeric: tabular-nums;
}

.page-size-selector {
	display: flex;
	align-items: center;
	gap: 8px;
}

.page-size-label {
	font-size: 13px;
	color: var(--text-color-base-300, #9a9a9d);
}

.page-size-select {
	padding: 4px 8px;
	font-size: 13px;
	color: var(--text-color-base-100, #ffffff);
	background: var(--bg-color-base-300, #333333);
	border: 1px solid var(--border-color-base-200, #444444);
	border-radius: 4px;
	cursor: pointer;
}

.page-size-select:focus {
	border-color: var(--accent-color-primary, #007aff);
	outline: none;
}

.pagination-controls {
	display: flex;
	align-items: center;
	gap: 8px;
}

.pagination-btn {
	display: flex;
	align-items: center;
	padding: 6px 12px;
	font-size: 13px;
	color: var(--text-color-base-100, #ffffff);
	background: var(--bg-color-base-300, #333333);
	border: 1px solid var(--border-color-base-200, #444444);
	border-radius: 6px;
	cursor: pointer;
	transition: all 0.2s ease;
	gap: 4px;
}

.pagination-btn:hover:not(:disabled) {
	background: var(--bg-color-base-400, #444444);
	border-color: var(--border-color-base-300, #555555);
}

.pagination-btn:disabled {
	cursor: not-allowed;
	opacity: 0.5;
}

.pagination-icon {
	font-weight: bold;
	font-size: 14px;
}

.page-numbers {
	display: flex;
	align-items: center;
	gap: 2px;
	margin: 0 8px;
}

.page-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	font-size: 13px;
	color: var(--text-color-base-200, #cccccc);
	background: transparent;
	border: 1px solid transparent;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.2s ease;
	font-variant-numeric: tabular-nums;
}

.page-btn:hover {
	background: var(--bg-color-base-300, #333333);
	border-color: var(--border-color-base-200, #444444);
}

.page-btn.active {
	color: #ffffff;
	background: var(--accent-color-primary, #007aff);
	border-color: var(--accent-color-primary, #007aff);
}

.pagination-ellipsis {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	font-size: 13px;
	color: var(--text-color-base-300, #9a9a9d);
}

@media (max-width: 768px) {
	.pagination-container {
		flex-direction: column;
		gap: 16px;
		align-items: stretch;
	}

	.pagination-info {
		justify-content: space-between;
	}

	.pagination-controls {
		justify-content: center;
	}
}
</style>
