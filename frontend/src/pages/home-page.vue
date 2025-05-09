<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDashboardGroupsStore } from '@/modules/dashboard-group';
import { DashboardGroupTabs } from '@/modules/dashboard-group-tabs';
import { LayoutComponent } from '@/modules/layout';
import { DashboardGrid } from '@/modules/dashboard-grid';

const dashboardStore = useDashboardGroupsStore();
const { addTab, switchTab, renameTab } = dashboardStore;
const { tabs, activeGroup } = storeToRefs(dashboardStore);
</script>

<template>
	<layout-component>
		<template #header>
			<dashboard-group-tabs
				:tabs="tabs"
				@add-tab="addTab"
				@switch-tab="switchTab"
				@rename-tab="renameTab"
			/>
		</template>
		<template #content>
			<dashboard-grid :dashboards="activeGroup" />
		</template>
	</layout-component>
</template>
