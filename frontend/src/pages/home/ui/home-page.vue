<script setup lang="ts">
import { FearGreedDashboard } from '@/modules/dashboards-view/dashboards/fear-greed';
import { TabsComponent } from '@/modules/dashboards-view/group';
import { LayoutComponent } from '@/modules/layaout';
</script>

<template>
	<layout-component>
		<template #header>
			<tabs-component />
		</template>
		<template #content>
			<fear-greed-dashboard market="test" />
		</template>
	</layout-component>
</template>
