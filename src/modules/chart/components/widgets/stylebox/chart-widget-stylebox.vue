<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';

import ChartStylebox from '@/modules/lightweight-charts/ui/chart-stylebox.vue';


</script>


<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.wrapperTitle">
				<div :class="classes.title">
					Stylebox
				</div>

				<div :class="classes.potential">
					large-scale
				</div>
			</div>
		</template>
		<template #body>
			<chart-stylebox />
		</template>
	</chart-common-widget-layout>
</template>


<style module="classes">
.wrapperTitle {
	display: flex;
	justify-content: space-between;
	align-items: center;
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
	color: #ffffff;
	background-color: rgb(31 31 31 / 70%);
	border-radius: 4px;
	gap: 4px;
}
</style>
