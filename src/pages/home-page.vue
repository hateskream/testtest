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
	isCurtainFixed: false,
	isEdit: false,
});

watch(
	columnsNum,
	cn => {
		// баг при закрытие шторки вызывается сетевой запрос
		// нужно обсудить с дизами, это бредовое состояние
		if (pageState.isCurtainFixed) {
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
	} else {
		pageState.isCurtainFixed = false;
	}
}, { deep: true });

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
				ref="dashboardGridRef"
				:active-dashboard-id="activeDashboardId"
				:dashboards="dashboards"
				:columns-num="columnsNum"
				:row-height="rowHeight"
				:rows-num="rowsNum"
				:col-width="columnWidth"
				:row-num="rowNumGrid"
				:column-width="columnWidth"
				:row-num-grid="rowNumGrid"
				:data-dashboard-grid="true"
				:data-grid-columns="columnsNum"
				:data-grid-rows="rowsNum"
				:data-row-height="rowHeight"
				:data-column-width="columnWidth"
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
