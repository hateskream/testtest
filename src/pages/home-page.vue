<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { reactive, watch, type ComponentPublicInstance } from 'vue';
import { templateRef } from '@vueuse/core';

import { DashboardGroupTabs } from '@/modules/dashboard-group-tabs';
import { LayoutComponent } from '@/modules/layout';
import {
	DashboardGrid,
	useDndHandler,
	useDelete,
	GhostComponentBase,
	useDashboardGroupsStore,
	useGridLayout,
} from '@/modules/dashboard-group';
import { DashboardsCurtain, DeleteComponent } from '@/modules/dashboards-curtain';

const dashboardStore = useDashboardGroupsStore();
const {
	addTab,
	switchTab,
	renameTab,
	addWidget,
	deleteWidget,
	changeDashboardState,
	loadDashboards,
} = dashboardStore;
const {
	tabs,
	activeDashboard,
	preset,
	activeDashboardId,
	dashboards,
} = storeToRefs(dashboardStore);

const { provideSetterDndHandler, onDrag, onDragEnd, setNewDashboard	} = useDndHandler();
const { provideCanDelete, setCanDelete } = useDelete();

const {
	rowsNum,
	columnsNum,
	rowHeight,
	columnWidth,
	rowNumGrid,
} = useGridLayout(
	templateRef<ComponentPublicInstance>('dashboardGridRef'),
);

provideSetterDndHandler();
provideCanDelete();

const pageState = reactive({
	isCurtainFixed: true,
	isEdit: false,
	forceCurtainFixed: false,
});

watch(
	columnsNum,
	cn => {
		if (pageState.isCurtainFixed && activeDashboard.value != null) {
			return;
		}

		loadDashboards(cn);
	},
);

watch(() => activeDashboard.value, (dashboard) => {
	if (dashboard == null) {
		return;
	}

	if (dashboard.widgets.length === 0) {
		pageState.isCurtainFixed = true;
		pageState.forceCurtainFixed = true;
	} else {
		pageState.isCurtainFixed = false;
		pageState.forceCurtainFixed = true;
	}
}, { deep: true });

function updateIsEdit(value: boolean) {
	pageState.isEdit = value;
}

</script>

<template>
	<layout-component
		v-model:is-curtain-fixed="pageState.isCurtainFixed"
		:is-edit-mode="pageState.isEdit"
		:force-curtain-fixed="pageState.forceCurtainFixed"
	>
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
				ref="dashboardGridRef"
				:active-dashboard-id="activeDashboardId"
				:dashboards="dashboards"
				:rows-num="rowsNum"
				:columns-num="columnsNum"
				:row-height="rowHeight"
				:column-width="columnWidth"
				:row-num-grid="rowNumGrid"
				@add-widget="addWidget"
				@delete-widget="deleteWidget"
				@change-dashboard-state="changeDashboardState"
				@is-edit="updateIsEdit"
			/>
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
