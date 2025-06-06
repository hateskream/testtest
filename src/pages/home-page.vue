<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { reactive, watch } from 'vue';
import { templateRef } from '@vueuse/core';

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
import { DashboardsCurtain, DeleteComponent } from '@/modules/dashboards-curtain';
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

const pageState = reactive({
	isCurtainFixed: false,
	isEdit: false,
});

watch(() => activeGroup.value.items, (newValue) => {
	if (newValue.length === 0) {
		pageState.isCurtainFixed = true;
	} else {
		pageState.isCurtainFixed = false;
	}
});

function updateIsEdit(value: boolean) {
	pageState.isEdit = value;
}


const dashbordTabsRef = templateRef('dashbordTabsRef');

const handleAddTab = () => {
	addTab();
	dashbordTabsRef.value?.renameTab();
};
</script>

<template>
	<layout-component v-model:is-curtain-fixed="pageState.isCurtainFixed" :is-edit-mode="pageState.isEdit">
		<template #header>
			<dashboard-group-tabs
				ref="dashbordTabsRef"
				:tabs="tabs"
				@add-tab="handleAddTab"
				@switch-tab="switchTab"
				@rename-tab="renameTab"
			/>
		</template>
		<template #content>
			<dashboard-grid
				:dashboards="activeGroup"
				@add-widget="setNewStateInCurrentGroup"
				@is-edit="updateIsEdit"
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
				v-model:is-curtain-fixed="pageState.isCurtainFixed"
				:dashboards="ALL_DASHBOARDS"
				@drag="onDrag"
				@drag-end="onDragEnd"
				@new-dashboard="setNewDashboard"
			>
				<template #ghost="{title}">
					<ghost-component-base :title="title" />
				</template>
			</dashboards-curtain>
		</template>
		<template #delete>
			<delete-component @set-can-delete="setCanDelete" />
		</template>
	</layout-component>
</template>
