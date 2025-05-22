<script setup lang="ts">
import { ref, computed } from 'vue';


import { ChartWidgetLayout } from '@/modules/chart/components/widgets/common/layouts';
import { RangeLine } from './components';
import { useChartStore } from '@/modules/chart/store';

import ChartPriceInfo from '@/modules/chart/components/common/components/chart-price-info/chart-price-info.vue';

const chartStore = useChartStore();
const selectedPeriod = ref('1D');

// Get range data from store's active exchange
const rangeData = computed(() => {
	return chartStore.activeExchangePeriods || {};
});

function formatDate(dateString: string) {
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	const monthNames = [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
	];

	const month = monthNames[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();

	let timeAgo = '';
	if (diffDays < 30) {
		timeAgo = `${diffDays} days ago`;
	} else if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		timeAgo = `${months} month${months > 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(diffDays / 365);
		timeAgo = `${years} year${years > 1 ? 's' : ''} ago`;
	}

	return `${month} ${day}, ${year} (${timeAgo})`;
};


const allTimeData = computed(() => {
	const data = chartStore.activeExchangeAllTime;
	if (!data) {
		return null;
	}

	return {
		high: {
			...data.high,
			formattedDate: formatDate(data.high.date),
		},
		low: {
			...data.low,
			formattedDate: formatDate(data.low.date),
		},
	};
});
</script>

<template>
	<chart-widget-layout>
		<template #header>
			<span>Price Performance</span>
		</template>
		<template #body>
			<range-line
				v-model="selectedPeriod"
				:data="rangeData"
			/>
			<div :class="classes.chartPriceWrapper">
				<chart-price-info />
			</div>

			<div v-if="allTimeData" :class="classes.allTimeWrapper">
				<div :class="classes.allTimeItem">
					<div :class="classes.line" class="paragraph-p-01">
						<div>All time high</div>
						<div>{{ chartStore.activeExchange?.currency_symbol }}{{ allTimeData.high.value }}</div>
					</div>
					<div :class="classes.line" class="paragraph-p-02">
						<div :class="classes.baseText">
							{{ allTimeData.high.formattedDate }}
						</div>
						<div :class="allTimeData.high.percentage >= 0 ? classes.positive : classes.negative">
							{{ allTimeData.high.percentage >= 0 ? '+' : '' }}{{ allTimeData.high.percentage }}%
						</div>
					</div>
				</div>

				<div :class="classes.allTimeItem">
					<div :class="classes.line" class="paragraph-p-01">
						<div>All time low</div>
						<div>{{ chartStore.activeExchange?.currency_symbol }}{{ allTimeData.low.value }}</div>
					</div>
					<div :class="classes.line" class="paragraph-p-02">
						<div :class="classes.baseText">
							{{ allTimeData.low.formattedDate }}
						</div>
						<div :class="allTimeData.low.percentage >= 0 ? classes.positive : classes.negative">
							{{ allTimeData.low.percentage >= 0 ? '+' : '' }}{{ allTimeData.low.percentage }}%
						</div>
					</div>
				</div>

				<div :class="classes.allTimeItem"></div>
			</div>
		</template>
	</chart-widget-layout>
</template>

<style module="classes">
.chartPriceWrapper {
	padding: 6px 0 14px;
}

.allTimeWrapper {
	display: flex;
	flex-direction: column;
}

.allTimeItem {
	display: flex;
	flex-direction: column;
	padding: 12px 0;
	border-top: 1px solid var(--border-color-surface-02);
	gap: 2px;
}

.line {
	display: flex;
	justify-content: space-between;
}

.negative {
	color: var(--metrics-color-negative-chart);
}

.positive {
	color: var(--metrics-color-positive-chart);
}

.baseText {
	color: var(--text-color-base-300);
}
</style>
