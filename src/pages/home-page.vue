<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

import { useDashboardGroupsStore } from '@/modules/dashboard-group';
import { DashboardGroupTabs } from '@/modules/dashboard-group-tabs';
import { LayoutComponent } from '@/modules/layout';
import {
	DashboardGrid,
	useProvideCurrentDashboard,
	useDndHandler,
	useDelete,
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
const { provideCanDelete, setCanDelete } = useDelete();

provideComponent(CurrentDashboard);
provideSetterDndHandler();
provideCanDelete();

const isCurtainFixed = ref(false);

watch(() => activeGroup.value.items, (newValue) => {
	if (newValue.length === 0) {
		isCurtainFixed.value = true;
	} else {
		isCurtainFixed.value = false;
	}
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
				@set-can-delete="setCanDelete"
			>
				<template #ghost="{title}">
					<ghost-component-base :title="title" />
				</template>
			</dashboards-curtain>
		</template>
	</layout-component>
</template>
