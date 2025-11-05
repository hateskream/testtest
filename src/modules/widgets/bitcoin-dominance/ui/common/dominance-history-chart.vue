<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';

import { useQueryDominanceHistory } from '@/modules/widgets/bitcoin-dominance/queries';
import type { IMeta } from '@/modules/dashboard-group';
import {
	DominanceDateRange,
	type IDominanceHistory,
	type IDominanceSnapshot,
} from '@/modules/widgets/bitcoin-dominance/model';
import { ChartDominance } from '@/modules/lightweight-charts';
import { UiSkeletonGroup } from '@/shared/ui/skeleton';
import { BaseErrorComponent } from '@/modules/widgets/base';
import type { IChartDominanceDataset } from '@/modules/lightweight-charts/model';

interface IDominanceChartProps {
	meta: IMeta;
	dateRange: DominanceDateRange;
	selectedTickers: string[];
	data: IDominanceSnapshot[];
}

const props = defineProps<IDominanceChartProps>();

const {
	data: history,
	isLoading,
	isError,
	refetch,
} = useQueryDominanceHistory(() => props.selectedTickers, () => props.dateRange);

function buildChartDatasets(historyValue: IDominanceHistory) {
	const { tickers } = historyValue;

	const dominanceValues = props.data.map(item => ({ id: item.id, value: item.dominance.current }));
	const orders = Object.fromEntries(dominanceValues.sort().map(item => [item.id, item.value]));

	const points = Object.fromEntries(
		tickers.map(ticker => {
			const tickerInfo = props.data.find(tcr => tcr.symbol === ticker)!;

			return [ticker, {
				label: ticker,
				color: tickerInfo.color,
				points: [],
				order: orders[tickerInfo.id],
			} as IChartDominanceDataset];
		}),
	);

	points.other = {
		label: 'Other',
		color: '#fff',
		points: [],
		order: 0,
	};

	historyValue.data.forEach(value => {
		let otherDominance = 100;

		tickers.forEach(ticker => {
			points[ticker].points.push({
				x: value.timestamp,
				y: value.dominance[ticker],
			});

			otherDominance -= Number(value.dominance[ticker]);
		});

		points.other.points.push({
			x: value.timestamp,
			y: otherDominance,
		});
	});

	return Object.values(points);
}

const preparedDatasets = shallowRef<IChartDominanceDataset[]>([]);

watch(history, (value) => {
	if (!value) {
		return;
	}

	preparedDatasets.value = buildChartDatasets(value);
}, { deep: true });

const isNotData = computed(() => !history.value && isLoading.value);

const isHideAxis = computed(() => props.meta.size.w <= 2 || props.meta.size.h <= 7);
</script>
<template>
	<div :class="[classes.wrapper, {[classes.visibleAxis]: !isHideAxis}]">
		<base-error-component
			v-if="isError"
			@retry="refetch"
		/>
		<ui-skeleton-group v-if="isNotData" />
		<chart-dominance
			v-else-if="history"
			:hide-axis="isHideAxis"
			:range="props.dateRange"
			:datasets="preparedDatasets"
			height="100%"
		/>
	</div>
</template>

<style module="classes">
.wrapper {
	flex: 1;
	height: 100%;
	overflow: hidden;
}

.wrapper.visibleAxis {
	padding-right: 16px;
}
</style>
