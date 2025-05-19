<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { provide, ref, watch } from 'vue';

import { useDashboardGroupsStore } from '@/modules/dashboard-group';
import { DashboardGroupTabs } from '@/modules/dashboard-group-tabs';
import { LayoutComponent } from '@/modules/layout';
import {
	DashboardGrid,
	useProvideCurrentDashboard,
	useDndHandler,
	GhostComponentBase,
} from '@/modules/dashboard-grid';
import { CurrentDashboard } from '@/modules/dashboards';
import { DashboardsCurtain } from '@/modules/dashboards-curtain';
import { ALL_DASHBOARDS } from '@/modules/dashboard-group/model';


const dashboardStore = useDashboardGroupsStore();
const { addTab, switchTab, renameTab, setNewStateInCurrentGroup } = dashboardStore;
const { tabs, activeGroup } = storeToRefs(dashboardStore);

const { provideComponent } = useProvideCurrentDashboard();

const { provideSetterDndHandler, onDrag, onDragEnd, setNewDashboard	} = useDndHandler();

provideComponent(CurrentDashboard);
provideSetterDndHandler();

const isIn = ref(false);
const isCurtainFixed = ref(false);

// const newDashboard = ref<IDashboardInstance | null>(null);

watch(() => activeGroup.value.items, (newValue) => {
	if (newValue.length === 0) {
		isCurtainFixed.value = true;
	} else {
		isCurtainFixed.value = false;
	}
});

// function setDashboard(dashboard: IDashboardInstance) {
// 	newDashboard.value = dashboard;
// }

function setIsIn(value: boolean) {
	isIn.value = value;
}

provide('funcSetter', {
	// newDashboard,
	isIn,
});
</script>

<template>
	<layout-component :is-curtain-fixed="isCurtainFixed">
		<template #header>
			<dashboard-group-tabs
				:tabs="tabs"
				@add-tab="addTab"
				@switch-tab="switchTab"
				@rename-tab="renameTab"
			/>
		</template>
		<template #content>
			<dashboard-grid
				:dashboards="activeGroup"
				class="grid"
				@add-widget="setNewStateInCurrentGroup"
			>
				<template #dashboard-content="{ dashboardItem, meta }">
					<current-dashboard
						:dashboard-item="dashboardItem"
						:meta="meta"
					/>
				</template>
			</dashboard-grid>
		</template>
		<template #curtain>
			<dashboards-curtain
				v-model:is-curtain-fixed="isCurtainFixed"
				:dashboards="ALL_DASHBOARDS"
				@drag="onDrag"
				@drag-end="onDragEnd"
				@new-dashboard="setNewDashboard"
				@is-in="setIsIn"
			>
				<template #ghost="{title}">
					<ghost-component-base :title="title" />
				</template>
			</dashboards-curtain>
		</template>
	</layout-component>
</template>
