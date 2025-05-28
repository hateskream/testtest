<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useChartStore } from '@/modules/chart/store';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ChartHeaderOpenClose, ChartHeaderStockSelect } from './components';
import { ChartHeaderStockBadge } from './ui';

const tickerName = 'Tesla inc';
const { isActiveMarketOpen, activeExchange } = storeToRefs(useChartStore());

</script>

<template>

	<div :class="classes.stockInfoWrapper">
		<div :class="classes.tickerName" class="header-h01">{{ tickerName }}</div>
		<div :class="classes.marketData">
			<chart-header-stock-select />
			<chart-header-open-close :is-open="isActiveMarketOpen" :market="activeExchange" />


			<chart-header-stock-badge v-if="activeExchange?.isPrimary">
				<ui-icon
					:id="IconIds.Crown"
					width="18"
					height="18"
				/>
			</chart-header-stock-badge>
			<chart-header-stock-badge>

				<div class="header-h03">≈</div>
			</chart-header-stock-badge>

		</div>
	</div>
</template>

<style module="classes">
.stockInfoWrapper {
	display: flex;
	align-items: center;
	height: 30px;
	gap: 12px;
}

.tickerName {
	color: var(--text-color-base-500);
}

.marketData {
	display: flex;
	gap: 3px;
	align-items: center;
}
</style>
