<script setup lang="ts">
import { TabsComponent, DashboardGroup } from '@/modules/dashboard-group';
import { LayoutComponent } from '@/modules/layout';
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
