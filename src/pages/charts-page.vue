<script setup lang="ts">
import { LayoutComponent } from '@/modules/layout';
import { ChartForecast } from '@/modules/lightweight-charts';


</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<chart-forecast
				:width="100"
				:height="400"
				disable-scroll
			/>

		</template>
	</layout-component>

</template>
