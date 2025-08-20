<script setup lang="ts">
import { computed } from 'vue';

import { getImagePath } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path.ts';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

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
		type: 'plate', // Custom type for our status plate
		group: {
			name: 'status',
			displayName: 'Status',
		},
	},
]);

const sampleData = computed(() => [
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
				value: 'volatile',
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
				value: '2.50',
			},
			priceChange: {
				value: '+45.2',
			},
			status: {
				value: 'buy',
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
				value: '-0.75',
			},
			priceChange: {
				value: '-12.3',
			},
			status: {
				value: 'sell',
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
				value: '0.00',
			},
			priceChange: {
				value: '0.0',
			},
			status: {
				value: 'neutral',
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
				value: '3.25',
			},
			priceChange: {
				value: '+67.8',
			},
			status: {
				value: 'sale',
			},
		},
	},
]);

const displayData = computed(() =>
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
			/>
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
