<script setup lang="ts">
import { reactive, type ComponentPublicInstance } from 'vue';
import { templateRef } from '@vueuse/core';

import { DashboardGroupTabs } from '@/modules/dashboard-group-tabs';
import { LayoutComponent } from '@/modules/layout';
import {
	DashboardGrid,
	useDndHandler,
	useDelete,
	GhostComponentBase,
	useGridLayout,
	useDashboardGroup,
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

	tabs,
	activeDashboard,
	preset,
	activeDashboardId,
	dashboards,
} = useDashboardGroup(columnsNum);

provideSetterDndHandler();
provideCanDelete();

const pageState = reactive({
	isCurtainFixed: isCurtainMustFixed(),
	isEdit: false,
});

function updateIsEdit(value: boolean) {
	pageState.isEdit = value;
}

function updateStateCurtainFixed(value: boolean) {
	if (isCurtainMustFixed()) {
		pageState.isCurtainFixed = true;
		return;
	}
	pageState.isCurtainFixed = value;
}

function isCurtainMustFixed(): boolean {
	const dashboard = activeDashboard.value;

	if (dashboard == null) {
		return false;
	}

	return dashboard.widgets.length === 0;
}

</script>

<template>
	<layout-component
		:is-curtain-fixed="pageState.isCurtainFixed"
		:is-edit-mode="pageState.isEdit"
		@update:is-curtain-fixed="updateStateCurtainFixed"
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
