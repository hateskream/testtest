<script setup lang="ts">
import { reactive, type ComponentPublicInstance, watch, computed } from 'vue';
import { templateRef } from '@vueuse/core';

import { LayoutComponent } from '@/modules/layout';
import {
	DashboardGrid,
	useDndHandler,
	useDelete,
	GhostComponentBase,
	useGridLayout,
	useDashboardGroup,
	DashboardGroupTabs,
} from '@/modules/dashboard-group';
import { DashboardsCurtain, DeleteComponent } from '@/modules/dashboards-curtain';

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

const {
	addTab,
	switchTab,
	renameTab,
	addWidget,
	deleteWidget,
	changeDashboardState,
	moveTo,
	deleteDashboard,
	undoDeleteTab,

	tabs,
	activeDashboard,
	preset,
	activeDashboardId,
	dashboards,
	isUndo,
} = useDashboardGroup(columnsNum);

provideSetterDndHandler();
provideCanDelete();

const pageState = reactive({
	isCurtainFixed: false,
	isEdit: false,
});

const isCurtainMustFixed = computed(() => {
	const dashboard = activeDashboard.value;
	if (!dashboard) {
		return false;
	}
	return dashboard.widgets.length === 0;
});

watch(isCurtainMustFixed, (mustBeFixed) => {
	if (mustBeFixed) {
		pageState.isCurtainFixed = true;
	} else {
		pageState.isCurtainFixed = false;
	}
}, { immediate: true });

function updateIsEdit(value: boolean) {
	pageState.isEdit = value;
}

function updateStateCurtainFixed(value: boolean) {
	if (isCurtainMustFixed.value) {
		pageState.isCurtainFixed = true;
		return;
	}
	pageState.isCurtainFixed = value;
}

function onAddTab() {
	pageState.isCurtainFixed = true;
	addTab();
}

</script>

<template>
	<layout-component
		:is-curtain-fixed="pageState.isCurtainFixed"
		:is-edit-mode="pageState.isEdit"
		:is-curtain-force-fixed="isCurtainMustFixed"
		@update:is-curtain-fixed="updateStateCurtainFixed"
	>
		<template #header>
			<dashboard-group-tabs
				:tabs="tabs"
				:is-undo="isUndo"
				@add-tab="onAddTab"
				@switch-tab="switchTab"
				@rename-tab="renameTab"
				@delete="deleteDashboard"
				@undo="undoDeleteTab"
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
				@move-to="moveTo"
			/>
		</template>
		<template #curtain>
			<dashboards-curtain
				:is-curtain-fixed="pageState.isCurtainFixed"
				:preset="preset"
				@update:is-curtain-fixed="updateStateCurtainFixed"
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
