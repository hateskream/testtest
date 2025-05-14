<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useChartStore } from '@/modules/chart/store';
import { IconIds, UiIcon } from '@/shared/ui/icon';

import ChartOpenClose from './chart-open-close.vue';
import ChartStockBadge from './chart-stock-badge.vue';
import ChartStockSelect from '@/modules/chart/components/header/chart-stock-select.vue';


const tickerName = 'Tesla inc';
const { isActiveMarketOpen, activeExchange } = storeToRefs(useChartStore());

</script>

<template>
	<div :class="classes.stockInfoWrapper">
		<div :class="classes.tickerName" class="header-h01">{{ tickerName }}</div>
		<div :class="classes.marketData">
			<chart-stock-select />
			<chart-open-close :is-open="isActiveMarketOpen" :market="activeExchange" />


			<chart-stock-badge v-if="activeExchange?.isPrimary">
				<ui-icon
					:id="IconIds.Crown"
					width="18"
					height="18"
				/>
			</chart-stock-badge>
			<chart-stock-badge>
				<div class="header-h03">≈</div>
			</chart-stock-badge>

		</div>
	</div>
</template>

<style module="classes">
.stockInfoWrapper {
	display: flex;
	gap: 12px;
	height: 30px;
	align-items: center;
}

.tickerName {
	color: var(--text-color-base-500)
}

.marketData {
	display: flex;
	gap: 3px;
	align-items: center;
}
</style>
