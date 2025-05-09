<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDashboardGroupsStore } from '@/modules/dashboard-group';
import { DashboardGroupTabs } from '@/modules/dashboard-group-tabs';
import { LayoutComponent } from '@/modules/layout';
import { DashboardGrid, useProvideCurrentDashboard } from '@/modules/dashboard-grid';
import { CurrentDashboard } from '@/modules/dashboards';

const dashboardStore = useDashboardGroupsStore();
const { addTab, switchTab, renameTab } = dashboardStore;
const { tabs, activeGroup } = storeToRefs(dashboardStore);

const { provideComponent } = useProvideCurrentDashboard();

provideComponent(CurrentDashboard);
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
			<dashboard-grid :dashboards="activeGroup">
				<template #dashboard-content="{ dashboardItem, meta }">
					<current-dashboard
						:dashboard-item="dashboardItem"
						:meta="meta"
					/>
				</template>
			</dashboard-grid>
		</template>
	</layout-component>
</template>
