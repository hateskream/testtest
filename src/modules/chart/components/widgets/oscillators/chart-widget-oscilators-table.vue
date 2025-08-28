<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { WidgetTypedTable, CellType } from '@/modules/widgets/widget-table';

type TSignal = 'buy' | 'sell' | 'neutral';


const title = 'Oscillators Table';
const overall: TSignal = 'neutral';
const items = [
	{
		id: 'rsi',
		data: {
			name: { value: 'Relative Strength Index (14)' },
			value: { value: '38.8435', magnitude: null },
			signal: { value: 'neutral' as TSignal },
		},
	},
	{
		id: 'stoch',
		data: {
			name: { value: 'Stochastic %K (14, 3, 3)' },
			value: { value: '12.5290', magnitude: null },
			signal: { value: 'neutral' as TSignal },
		},
	},
	{
		id: 'cci',
		data: {
			name: { value: 'Commodity Channel Index (20)' },
			value: { value: '-128.2618', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'adx',
		data: {
			name: { value: 'Average Directional Index (14)' },
			value: { value: '24.8059', magnitude: null },
			signal: { value: 'neutral' as TSignal },
		},
	},
	{
		id: 'ao',
		data: {
			name: { value: 'Awesome Oscillator' },
			value: { value: '-0.4316', magnitude: null },
			signal: { value: 'neutral' as TSignal },
		},
	},
	{
		id: 'mom',
		data: {
			name: { value: 'Momentum (10)' },
			value: { value: '-0.5793', magnitude: null },
			signal: { value: 'sell' as TSignal },
		},
	},
	{
		id: 'macd',
		data: {
			name: { value: 'MACD Level (12, 26)' },
			value: { value: '-0.1221', magnitude: null },
			signal: { value: 'sell' as TSignal },
		},
	},
	{
		id: 'stoch_rsi',
		data: {
			name: { value: 'Stochastic RSI Fast (3, 3, 14, 14)' },
			value: { value: '12.9350', magnitude: null },
			signal: { value: 'buy' as TSignal },
		},
	},
	{
		id: 'wpr',
		data: {
			name: { value: 'Williams Percent Range (14)' },
			value: { value: '-75.6284', magnitude: null },
			signal: { value: 'neutral' as TSignal },
		},
	},
	{
		id: 'bbp',
		data: {
			name: { value: 'Bull Bear Power' },
			value: { value: '-0.5912', magnitude: null },
			signal: { value: 'neutral' as TSignal },
		},
	},
	{
		id: 'uo',
		data: {
			name: { value: 'Ultimate Oscillator (7, 14, 28)' },
			value: { value: '47.4630', magnitude: null },
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
		group: { name: 'Osc', displayName: 'Osc' },
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
		group: { name: 'Osc', displayName: 'Osc' },
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
		group: { name: 'Osc', displayName: 'Osc' },
	},
];


</script>

<template>
	<chart-common-widget-layout without-padding>
		<template #header>

			<div :class="classes.header">
				Oscillators table
				<div
					:class="classes.summary"
				>
					Neutral
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
