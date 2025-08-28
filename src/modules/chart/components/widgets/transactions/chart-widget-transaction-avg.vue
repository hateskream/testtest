<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';

import ChartTransactionAvg from '@/modules/lightweight-charts/ui/chart-transaction-avg.vue';

</script>


<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.wrapperTitle">
				<div :class="classes.title">
					Bitcoin Avg Transaction Fees (30d)
				</div>
			</div>
		</template>
		<template #body>
			<div :class="classes.wrapper">
				<div :class="classes.avgPrice">
					<div :class="classes.avgPriceUe">
						$0.3355
					</div>
					<div :class="classes.avgPriceCoin">
						<div :class="classes.avgPriceCoinCircle"></div>
						<span>0.000028 BTC</span>
					</div>
				</div>
				<chart-transaction-avg />
			</div>
		</template>
	</chart-common-widget-layout>
</template>


<style module="classes">
.wrapper {
	display: flex;
	align-items: center;
}

.avgPrice {
	display: flex;
	flex: 0 0 20%;
	flex-direction: column;
	gap: 4px;
}

.avgPriceUe {
	font-weight: 400;
	font-size: 15px;
	color: var(--text-color-base-500);
	letter-spacing: 0.165px;
}

.avgPriceCoin {
	display: flex;
	align-items: center;
	font-style: normal;
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
	gap: 4px;
}

.avgPriceCoinCircle {
	width: 2px;
	height: 2px;
	background-color: #ffffff;
	border-radius: 100px;
}

.wrapperTitle {
	display: flex;
	gap: 8px;
	align-items: center;
}

.title {
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	letter-spacing: 0.104px;
}
</style>
