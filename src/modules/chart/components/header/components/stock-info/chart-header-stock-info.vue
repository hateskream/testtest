<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useChartStore } from '@/modules/chart/store';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ChartHeaderOpenClose, ChartHeaderStockSelect } from './components';
import { ChartHeaderStockBadge } from './ui';
import { UiText } from '@/shared/ui/text';

;
const { isActiveMarketOpen, activeExchange } = storeToRefs(useChartStore());

interface IStockInfoProps {
	tickerName:string;
}

const props = defineProps<IStockInfoProps>();


</script>

<template>
	<div :class="classes.stockInfoWrapper">
		<ui-text
			:class="classes.tickerName"
			token="title-300"
			as="div"
		>
			{{ props.tickerName }}
		</ui-text>
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
				<ui-text token="title-500">≈</ui-text>
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
