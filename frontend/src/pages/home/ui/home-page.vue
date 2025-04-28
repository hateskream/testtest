<script setup lang="ts">
import { TabsComponent, DashboardGroup } from '@/modules/dashboards-view/group';
import { LayoutComponent } from '@/modules/layaout';
</script>

<template>
	<layout-component>
		<template #header>
			<tabs-component />
		</template>
		<template #content>
			<dashboard-group />
		</template>
	</layout-component>
</template>
