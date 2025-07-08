<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { reactive, watch } from 'vue';

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

const dashboardStore = useDashboardGroupsStore();
const { addTab, switchTab, renameTab, addWidget, deleteWidget, changeDashboardState } = dashboardStore;
const { tabs, activeDashboard, preset } = storeToRefs(dashboardStore);

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

watch(() => activeDashboard.value, (dashboard) => {
	if (dashboard == null) {
		return;
	}

	if (dashboard.widgets.length === 0) {
		pageState.isCurtainFixed = true;
	} else {
		pageState.isCurtainFixed = false;
	}
});

function updateIsEdit(value: boolean) {
	pageState.isEdit = value;
}
</script>

<template>
	<layout-component v-model:is-curtain-fixed="pageState.isCurtainFixed" :is-edit-mode="pageState.isEdit">
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
				v-if="activeDashboard"
				:widgets="activeDashboard.widgets"
				@add-widget="addWidget"
				@delete-widget="deleteWidget"
				@change-dashboard-state="changeDashboardState"
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
				:preset="preset"
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
