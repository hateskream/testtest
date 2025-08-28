<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { WidgetTypedTable, CellType } from '@/modules/widgets/widget-table';

type TSignal = 'buy' | 'sell' | 'neutral';

const title = 'Moving Averages Table';
const overall: TSignal = 'sell';
const items = [
	{
		id: 'sma_10',
		data: {
			name: { value: 'Simple Moving Average (10)' },
			value: { value: '152.4567', magnitude: null },
			signal: { value: 'sell' as TSignal },
		},
	},
	{
		id: 'sma_20',
		data: {
			name: { value: 'Simple Moving Average (20)' },
			value: { value: '154.8921', magnitude: null },
			signal: { value: 'sell' as TSignal },
		},
	},
	{
		id: 'sma_50',
		data: {
			name: { value: 'Simple Moving Average (50)' },
			value: { value: '158.2145', magnitude: null },
			signal: { value: 'sell' as TSignal },
		},
	},
	{
		id: 'ema_10',
		data: {
			name: { value: 'Exponential Moving Average (10)' },
			value: { value: '151.7834', magnitude: null },
			signal: { value: 'sell' as TSignal },
		},
	},
	{
		id: 'ema_20',
		data: {
			name: { value: 'Exponential Moving Average (20)' },
			value: { value: '153.9567', magnitude: null },
			signal: { value: 'sell' as TSignal },
		},
	},
	{
		id: 'ema_50',
		data: {
			name: { value: 'Exponential Moving Average (50)' },
			value: { value: '156.4821', magnitude: null },
			signal: { value: 'sell' as TSignal },
		},
	},
	{
		id: 'wma_20',
		data: {
			name: { value: 'Weighted Moving Average (20)' },
			value: { value: '152.8934', magnitude: null },
			signal: { value: 'neutral' as TSignal },
		},
	},
	{
		id: 'hma_9',
		data: {
			name: { value: 'Hull Moving Average (9)' },
			value: { value: '150.2456', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'tema_30',
		data: {
			name: { value: 'Triple EMA (30)' },
			value: { value: '154.1672', magnitude: null },
			signal: { value: 'neutral' as TSignal },
		},
	},
	{
		id: 'vwma_20',
		data: {
			name: { value: 'Volume Weighted MA (20)' },
			value: { value: '153.5789', magnitude: null },
			signal: { value: 'sell' as TSignal },
		},
	},
	{
		id: 'kama_14',
		data: {
			name: { value: 'Kaufman Adaptive MA (14)' },
			value: { value: '155.8923', magnitude: null },
			signal: { value: 'neutral' as TSignal },
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
					:class="classes.summary"
				>
					Sell
				</div>
			</div>
		</template>
		<template #title>
			<div :class="classes.header">
				<div class="header-h03">{{ title }}</div>
				<div :class="[classes.pill, classes[overall]]">
					{{ overall.charAt(0).toUpperCase() + overall.slice(1) }}
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

.buy {
	color: #0fe18b;
	background: rgb(22 163 74 / 18%);
}

.sell {
	color: #ff6b6b;
	background: rgb(220 38 38 / 18%);
}

.neutral {
	color: var(--text-color-base-300);
	background: rgb(140 140 155 / 12%);
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
	background: rgb(31 31 31 / 70%);
	border-radius: 4px;
}
</style>
