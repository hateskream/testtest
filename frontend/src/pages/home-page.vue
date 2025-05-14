<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { provide, ref } from 'vue';

import { useDashboardGroupsStore } from '@/modules/dashboard-group';
import { DashboardGroupTabs } from '@/modules/dashboard-group-tabs';
import { LayoutComponent } from '@/modules/layout';
import {
	DashboardGrid,
	DraggableElement,
	useProvideCurrentDashboard,
	GhostComponentBase
} from '@/modules/dashboard-grid';
import { CurrentDashboard } from '@/modules/dashboards';

const dashboardStore = useDashboardGroupsStore();
const { addTab, switchTab, renameTab, setNewStateInCurrentGroup } = dashboardStore;
const { tabs, activeGroup } = storeToRefs(dashboardStore);

const { provideComponent } = useProvideCurrentDashboard();

provideComponent(CurrentDashboard);

const drag = ref<(() => void)>(() => {});
const dragEnd = ref<(() => void)>(() => {});

function setDrag(func: () => void) {
	drag.value = func;
}

function setDragEnd(func: () => void) {
	dragEnd.value = func;
}

provide('funcSetter', {
	setDrag,
	setDragEnd,
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
					<draggable-element @drag="drag" @drag-end="dragEnd">
						<ghost-component-base title="dfsdfsdf" />
					</draggable-element>
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
