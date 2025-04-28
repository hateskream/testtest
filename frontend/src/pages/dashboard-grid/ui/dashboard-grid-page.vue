<script setup lang="ts">
import { TabsComponent } from '@/modules/dashboards-view/group';
import { LayoutComponent } from '@/modules/layaout';
import { TestDashboardGrid } from '@/modules/test-dashboard-grid';
</script>

<template>
	<layout-component>
		<template #header>
			<tabs-component />
		</template>
		<template #content>
			<test-dashboard-grid />
		</template>
	</layout-component>
</template>
