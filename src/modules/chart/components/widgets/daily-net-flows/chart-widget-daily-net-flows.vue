<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { ChartDailyNetFlows } from '@/modules/lightweight-charts';


</script>


<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.wrapperTitle">
				<div :class="classes.title">
					Daily Net Flows
				</div>

				<div :class="classes.potential">
					2 Billions
				</div>
			</div>
		</template>
		<template #body>
			<chart-daily-net-flows />
		</template>
	</chart-common-widget-layout>
</template>


<style module="classes">
.wrapperTitle {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	gap: 8px;
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
