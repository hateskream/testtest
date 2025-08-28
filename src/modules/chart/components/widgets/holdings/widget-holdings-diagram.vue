<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { ChartHoldingsDiagram } from '@/modules/lightweight-charts';

</script>


<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.wrapperTitle">
				<div :class="classes.title">
					Holdings Diagram
				</div>
			</div>
		</template>
		<template #body>
			<chart-holdings-diagram />
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
