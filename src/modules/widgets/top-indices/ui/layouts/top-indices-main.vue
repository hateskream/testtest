
<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { computed } from 'vue';

import { getImagePath } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path.ts';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';
import CellPlate from '@/modules/widgets/widget-table/cells/cell-plate.vue';

interface IIndicesData {
	id: string;
	data: {
		symbol: {
			symbolType: string;
			srcImg: string;
			ticker: string;
			country: string;
		};
		percentage: {
			value: string;
		};
		priceChange: {
			value: string;
		};
		status: {
			value: 'red' | 'yellow' | 'green' | 'gray';
		};
	};
}

interface IProps {
	meta: IIndicesData[];
}

const props = defineProps<IProps>();

// Define columns for the indices table
const columns = computed(() => [
	{
		key: 'symbol',
		label: 'Symbol',
		shortLabel: 'Symbol',
		position: 0,
		sortable: true,
		draggable: false,
		visible: true,
		type: 'image-string',
		group: {
			name: 'symbol',
			displayName: 'Symbol',
		},
	},
	{
		key: 'percentage',
		label: 'Percentage',
		shortLabel: '%',
		position: 1,
		sortable: true,
		draggable: true,
		visible: true,
		type: 'percent',
		group: {
			name: 'percentage',
			displayName: 'Percentage',
		},
	},
	{
		key: 'priceChange',
		label: 'Price Change',
		shortLabel: 'Change',
		position: 2,
		sortable: true,
		draggable: true,
		visible: true,
		type: 'number',
		group: {
			name: 'change',
			displayName: 'Change',
		},
	},
	{
		key: 'status',
		label: 'Status',
		shortLabel: 'Status',
		position: 3,
		sortable: false,
		draggable: true,
		visible: true,
		type: 'status-plate', // Custom type for our status plate
		group: {
			name: 'status',
			displayName: 'Status',
		},
	},
]);

// Convert props.indices to the format expected by WidgetTypedTable
const genericRows = computed(() =>
	props.meta.map(item => ({
		id: item.id,
		data: item.data,
		metadata: {
			srcValue: item.data.symbol.srcImg,
		},
	})),
);

// Sample data for demonstration (you can remove this and use only props)
const sampleData = computed((): IIndicesData[] => [
	{
		id: '1',
		data: {
			symbol: {
				symbolType: 'Index',
				srcImg: '/flags/spain.png',
				ticker: 'Spain',
				country: 'Spain',
			},
			percentage: {
				value: '1.00',
			},
			priceChange: {
				value: '+38.0',
			},
			status: {
				value: 'yellow',
			},
		},
	},
	{
		id: '2',
		data: {
			symbol: {
				symbolType: 'Index',
				srcImg: '/flags/germany.png',
				ticker: 'Germany',
				country: 'Germany',
			},
			percentage: {
				value: '1.00',
			},
			priceChange: {
				value: '+38.0',
			},
			status: {
				value: 'yellow',
			},
		},
	},
	{
		id: '3',
		data: {
			symbol: {
				symbolType: 'Index',
				srcImg: getImagePath('ADA', ImageTypePath.Currency),
				ticker: 'Italy',
				country: 'Italy',
			},
			percentage: {
				value: '1.00',
			},
			priceChange: {
				value: '+38.0',
			},
			status: {
				value: 'yellow',
			},
		},
	},
	{
		id: '4',
		data: {
			symbol: {
				symbolType: 'Index',
				srcImg: getImagePath('ADA', ImageTypePath.Currency),
				ticker: 'Brazil',
				country: 'Brazil',
			},
			percentage: {
				value: '1.00',
			},
			priceChange: {
				value: '+38.0',
			},
			status: {
				value: 'yellow',
			},
		},
	},
	{
		id: '5',
		data: {
			symbol: {
				symbolType: 'Index',
				srcImg: getImagePath('ADA', ImageTypePath.Currency),
				ticker: 'Sweden',
				country: 'Sweden',
			},
			percentage: {
				value: '1.00',
			},
			priceChange: {
				value: '+38.0',
			},
			status: {
				value: 'yellow',
			},
		},
	},
]);

// Use provided data or sample data
const displayData = computed(() => props.indices?.length > 0 ? genericRows.value :
	sampleData.value.map(item => ({
		id: item.id,
		data: item.data,
		metadata: {
			srcValue: item.data.symbol.srcImg,
		},
	})),
);
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.scrollable">
			<widget-typed-table
				:columns="columns"
				:rows="displayData"
				:enable-drag-drop="false"
				:enable-column-reordering="true"
				:enable-sorting="false"
				:enable-column-settings="true"
				:sticky-header="true"
				:sticky-first-column="true"
				:enable-row-actions="false"
				:show-header="false"
			>
				<!-- Custom slot for status plate column -->
				<template #cell-status="{ row }">
					<cell-plate :data="row.data.status.value" />
				</template>
			</widget-typed-table>
		</div>
	</div>

</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 18px;
	overflow: hidden;
}


.scrollable {
	position: relative;
	height: 100%;
	overflow: auto;
}
</style>
