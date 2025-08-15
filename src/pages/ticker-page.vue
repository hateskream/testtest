<script setup lang="ts">

import { LayoutComponent } from '@/modules/layout';
import { ChartComponent } from '@/modules/chart';
import type { TickerType } from '@/types/route';


interface ITickerPageProps {
	id:number;
	type: TickerType;
}

const props = defineProps<ITickerPageProps>();

</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<chart-component :id="props.id" :type="props.type" />
		</template>
	</layout-component>
</template>

<style module="classes">

</style>
