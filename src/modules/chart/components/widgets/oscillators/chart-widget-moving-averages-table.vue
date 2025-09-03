<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { WidgetTypedTable, CellType } from '@/modules/widgets/widget-table';

type TSignal = 'buy' | 'sell' | 'neutral';

const overall: TSignal = 'buy';
const items = [
	{
		id: 'ema_10',
		data: {
			name: { value: 'Exponential Moving Average (10)' },
			value: { value: '3.6591', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'sma_10',
		data: {
			name: { value: 'Simple Moving Average (10)' },
			value: { value: '3.5740', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'ema_20',
		data: {
			name: { value: 'Exponential Moving Average (20)' },
			value: { value: '3.6581', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'sma_30',
		data: {
			name: { value: 'Simple Moving Average (30)' },
			value: { value: '3.7601', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'ema_30',
		data: {
			name: { value: 'Exponential Moving Average (30)' },
			value: { value: '3.6126', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'sma_50',
		data: {
			name: { value: 'Simple Moving Average (50)' },
			value: { value: '3.7508', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'ema_50',
		data: {
			name: { value: 'Exponential Moving Average (50)' },
			value: { value: '3.5160', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'sma_50_2',
		data: {
			name: { value: 'Simple Moving Average (50)' },
			value: { value: '3.3699', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'ema_100',
		data: {
			name: { value: 'Exponential Moving Average (100)' },
			value: { value: '3.3722', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'sma_100',
		data: {
			name: { value: 'Simple Moving Average (100)' },
			value: { value: '3.4233', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'ema_200',
		data: {
			name: { value: 'Exponential Moving Average (200)' },
			value: { value: '3.1985', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'sma_200',
		data: {
			name: { value: 'Simple Moving Average (200)' },
			value: { value: '3.1473', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'ichimoku_base_line',
		data: {
			name: { value: 'Ichimoku Base Line (9, 26, 52, 26)' },
			value: { value: '3.3864', magnitude: null },
			signal: { value: 'neutral' as TSignal },
		},
	},
	{
		id: 'vwma_20',
		data: {
			name: { value: 'Volume Weighted Moving Average (20)' },
			value: { value: '3.7852', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'hma_9',
		data: {
			name: { value: 'Hull Moving Average (9)' },
			value: { value: '3.7184', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
];

// table columns
const columns = [
	{
		key: 'name',
		label: 'Indicator',
		shortLabel: 'Indicator',
		position: 0,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'MA', displayName: 'MA' },
	},
	{
		key: 'value',
		label: 'Value',
		shortLabel: 'Value',
		position: 1,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'MA', displayName: 'MA' },
	},
	{
		key: 'signal',
		label: 'Signal',
		shortLabel: 'Signal',
		position: 2,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.PLATE,
		group: { name: 'MA', displayName: 'MA' },
	},
];
</script>

<template>
	<chart-common-widget-layout without-padding>
		<template #header>
			<div :class="classes.header">
				Moving Averages table
				<div
					:class="[classes.summary, classes[overall]]"
				>
					{{overall}}
				</div>
			</div>
		</template>

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
				:show-header="false"
			>
				<template #[`cell-name`]="{ row }">
					<div :class="classes.left" class="paragraph-p-00">
						{{ row.data.name?.value ?? '—' }}
					</div>
				</template>
			</widget-typed-table>
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.left {
	text-align: left;
	color: var(--text-color-base-500);
}

.pill {
	display: inline-flex;
	align-items: center;
	height: 24px;
	padding: 0 10px;
	font-size: 12px;
	line-height: 1;
	white-space: nowrap;
	border-radius: 8px;
}


.header {
	display: inline-flex;
	justify-content: space-between;
	width: 100%;
}

.summary {
	display: flex;
	align-items: center;
	padding: 1px 5px;
	font-size: 12px;
	line-height: normal;
	color: #999999;
	text-transform: capitalize;
	background: rgb(31 31 31 / 70%);
	border-radius: 4px;

	&.buy {
		color: #0fe18b;
		background: rgb(22 163 74 / 18%);
	}

	&.sell {
		color: #ff6b6b;
		background: rgb(220 38 38 / 18%);
	}

	&.neutral {
		color: var(--text-color-base-300);
		background: rgb(140 140 155 / 12%);
	}
}
</style>
