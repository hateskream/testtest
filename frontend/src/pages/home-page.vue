<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { provide, ref } from 'vue';

import { useDashboardGroupsStore, type IDashboardInstance } from '@/modules/dashboard-group';
import { DashboardGroupTabs } from '@/modules/dashboard-group-tabs';
import { LayoutComponent } from '@/modules/layout';
import {
	DashboardGrid,
	DraggableElement,
	useProvideCurrentDashboard,
	GhostComponentBase
} from '@/modules/dashboard-grid';
import { CurrentDashboard } from '@/modules/dashboards';
import { DashboardsCurtain } from '@/modules/dashboards-curtain';
import { ALL_DASHBOARDS } from '@/modules/dashboard-group/model';

const dashboardStore = useDashboardGroupsStore();
const { addTab, switchTab, renameTab, setNewStateInCurrentGroup } = dashboardStore;
const { tabs, activeGroup } = storeToRefs(dashboardStore);

const { provideComponent } = useProvideCurrentDashboard();

provideComponent(CurrentDashboard);

const drag = ref<(() => void)>(() => {});
const dragEnd = ref<(() => void)>(() => {});

const newDashboard = ref<IDashboardInstance | null>(null);

function setDrag(func: () => void) {
	drag.value = func;
}

function setDragEnd(func: () => void) {
	dragEnd.value = func;
}

function setDashboard(dashboard: IDashboardInstance) {
	newDashboard.value = dashboard;
}

provide('funcSetter', {
	setDrag,
	setDragEnd,
	newDashboard
});
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
				<dashboard-grid :dashboards="activeGroup" class="grid" @add-widget="setNewStateInCurrentGroup">
					<template #dashboard-content="{ dashboardItem, meta }">
						<current-dashboard
							:dashboard-item="dashboardItem"
							:meta="meta"
						/>
					</template>
				</dashboard-grid>
				<div>
					<dashboards-curtain
						:dashboards="ALL_DASHBOARDS"
						@drag="drag"
						@drag-end="dragEnd"
						@new-dashboard="setDashboard"
					>
						<template #ghost="{title}">
							<ghost-component-base :title="title" />
						</template>
					</dashboards-curtain>
					<div>
					</div>
				</div>
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
