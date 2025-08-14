<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';

import ChartTransactionAvgTotal from '@/modules/lightweight-charts/ui/chart-transaction-avg-total.vue';
</script>


<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.wrapperTitle">
				<div :class="classes.title">
					Bitcoin Average Transaction Fee (I:BATF)
				</div>
			</div>
		</template>
		<template #body>
			<chart-transaction-avg-total />
		</template>
	</chart-common-widget-layout>
</template>


<style module="classes">
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
