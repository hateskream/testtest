<script setup lang="ts">

import { LayoutComponent } from '@/modules/layout';
import { ChartComponent } from '@/modules/chart';


</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<chart-component type="stock" />
		</template>
	</layout-component>
</template>

<style module="classes">

</style>
