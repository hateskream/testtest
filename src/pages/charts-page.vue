<script setup lang="ts">
import { LayoutComponent } from '@/modules/layout';
import { ChartForecast, ChartYearlyRevenue } from '@/modules/lightweight-charts';


</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<div style="display: flex; flex-direction: column; width: 100%; height: 100%;">
				<chart-forecast
					:width="100"
					:height="400"
				/>

				<chart-yearly-revenue
					:width="100"
					:height="400"
				/>
			</div>

		</template>
	</layout-component>

</template>
