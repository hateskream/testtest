<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useDashboardGroupsStore } from '@/modules/dashboard-group';
import { DashboardGroupTabs } from '@/modules/dashboard-group-tabs';
import { LayoutComponent } from '@/modules/layout';
import { DashboardGrid, DraggableElement, useProvideCurrentDashboard } from '@/modules/dashboard-grid';
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
			<div class="root">
				<dashboard-grid :dashboards="activeGroup" class="grid">
					<template #dashboard-content="{ dashboardItem, meta }">
						<current-dashboard
							:dashboard-item="dashboardItem"
							:meta="meta"
						/>
					</template>
				</dashboard-grid>
				<draggable-element />
			</div>

		</template>
	</layout-component>
</template>

<style scoped>
.root {
	display: flex;
}

.grid {
	flex-grow: 1;
}
</style>
