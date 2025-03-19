<script setup lang="ts">
import { FearGreedDashboard } from '@/modules/dashboards-view/dashboards/fear-greed';
import { LayoutComponent } from '@/modules/layaout';
</script>

<template>
	<layout-component>
		<template #header>
			<div />
		</template>
		<template #content>
			<fear-greed-dashboard market="test" />
		</template>
	</layout-component>
</template>
