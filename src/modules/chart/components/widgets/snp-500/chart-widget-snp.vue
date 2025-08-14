<script setup lang="ts">
import { ref } from 'vue';

import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { RangeChart } from '@/shared/ui/chart-range';

import ChartTooltip from '@/modules/lightweight-charts/ui/chart-tooltip.vue';


const activeRange = ref(RangeChart['1D']);

const date = new Date(Date.UTC(2000));

const data = ref<{
	date: Date;
	value: number;
}[]>([]);

for (let i = 0; i < 50; i++) {
	data.value.push({
		value: Math.random() * (100 - 10) - 10,
		date,
	});

	date.setUTCDate(date.getUTCDate() + 10);
}

</script>


<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.wrapperTitle">
				<div :class="classes.title">
				</div>

				<!-- <div :class="classes.potential">
					$638.35 (+12.92%) potential
				</div> -->
			</div>
		</template>
		<template #body>
			<chart-tooltip
				:active-range="activeRange"
				:badge="{
					color: '#000',
					text: 'Neutral'
				}"
				:data="data"
				:range-list="[RangeChart['1D'], RangeChart['1W'], RangeChart['1M'], RangeChart['1Y'], RangeChart['ALL']]"
			>
				<template #title>
					S&P 500
				</template>
			</chart-tooltip>
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

.potential {
	display: flex;
	align-items: center;
	padding: 1px 5px;
	font-weight: 440;
	font-size: 10px;
	line-height: 17px;
	color: #04eda0;
	background-color: rgb(31 31 31 / 70%);
	border-radius: 4px;
	gap: 4px;
}
</style>
