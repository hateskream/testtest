<script setup lang="ts">
import { computed, createApp, onBeforeMount, reactive, ref, watch, type App } from 'vue';
import { GridLayout, type Layout } from 'grid-layout-plus';
import { VueQueryPlugin } from '@tanstack/vue-query';

import { useRebuildingGrid } from '../../../composables';
import type { IDashboardGroup, IDashboardItem, IPositionWithId } from '../../../model';

import DashboardGridElement from './dashboard-grid-element.vue';
import CurrentDashboard from '../dashboard/current-dashboard.vue';
import PlaceholderComponent from './placeholder-component.vue';
import GhostMoveComponent from './ghost-move-component.vue';

interface IGridState {
	isDnd: boolean;
	isResize: boolean;
	isUserInteracted: boolean;
}

interface IGridLayoutComponent {
	dashboards: IDashboardGroup;
	isDnd: boolean;
	columnsNum: number;
	rowsNum: number;
	rowHeight: number;
}

const props = defineProps<IGridLayoutComponent>();

const emit = defineEmits<{
	(e: 'update-is-show-grid-state', value: boolean): void;
	(e: 'setWrapper', value: HTMLDivElement): void;
	(e: 'setGridLayoutRef', value: InstanceType<typeof GridLayout>): void;
}>();

let mountedPlaceholder: App<Element> | null = null;

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout> | null>(null);

const gridState = reactive<IGridState>({
	isDnd: false,
	isResize: false,
	isUserInteracted: false,
});

const rawDashboards = computed((): IPositionWithId[] =>
	props.dashboards.items.map(el => ({ ...el.position, i: el.id })),
);

const columnsNum = computed(() => props.columnsNum);
const rowsNum = computed(() => props.rowsNum);

const { layout } = useRebuildingGrid(columnsNum, rowsNum, rawDashboards);

watch(
	wrapperRef,
	value => {
		if (value) {
			emit('setWrapper', value);
		}
	},
	{
		once: true,
	},
);

watch(
	gridLayoutRef,
	value => {
		if (value) {
			emit('setGridLayoutRef', value);
		}
	},
	{
		once: true,
	},
);

watch(
	() => gridState.isUserInteracted,
	() => emit('update-is-show-grid-state', false),
);

watch([() => gridState.isDnd, () => gridState.isResize], ([isDnd, isResize]) =>
	emit('update-is-show-grid-state', isDnd || isResize),
);

watch(
	() => gridState.isDnd,
	isDnd => {
		if (isDnd) {
			mountedPlaceholder = createApp(PlaceholderComponent);
			mountPlaceholderComponents(mountedPlaceholder);
		} else {
			unmountPlaceholderComponents();
		}
	},
);

watch(
	() => gridState.isResize,
	isDnd => {
		if (isDnd) {
			mountedPlaceholder = createApp(CurrentDashboard, {
				dashboardItem: getDashboardItemById(1),
			});
			mountedPlaceholder.use(VueQueryPlugin);

			mountPlaceholderComponents(mountedPlaceholder);
		} else {
			unmountPlaceholderComponents();
		}
	},
);

onBeforeMount(unmountPlaceholderComponents);

function getDashboardItemById(id: number): IDashboardItem {
	const foundDashboard = props.dashboards.items.find(item => item.id === id);
	if (foundDashboard) {
		return foundDashboard;
	}

	throw new Error(`Dashboard with id ${id} not found`);
}

function updated() {
	if (!gridState.isUserInteracted) {
		gridState.isUserInteracted = true;
	}
}

function onChangeDndState(newValue: boolean) {
	gridState.isDnd = newValue;
}

function onChangeResizeState(newValue: boolean) {
	gridState.isResize = newValue;
}

function mountPlaceholderComponents(placeholderComponent: App<Element>) {
	if (!gridLayoutRef.value) {
		return;
	}

	const placeholder = gridLayoutRef.value.$el.querySelector(
		'.dashboard-grid > .vgl-item--placeholder',
	);

	if (!(placeholder instanceof HTMLElement)) {
		return;
	}

	placeholderComponent.mount(placeholder);
}

function unmountPlaceholderComponents() {
	if (mountedPlaceholder) {
		mountedPlaceholder.unmount();
		mountedPlaceholder = null;
	}
}
</script>

<template>
	<div
		ref="wrapperRef"
		@dragover.prevent
	>
		<grid-layout
			ref="gridLayoutRef"
			:layout="layout"
			:col-num="columnsNum"
			:row-height="rowHeight"
			:is-draggable="true"
			:is-resizable="true"
			:prevent-collision="false"
			:use-css-transforms="false"
			:margin="[0, 0]"
			class="dashboard-grid"
			@layout-updated="updated"
		>
			<dashboard-grid-element
				v-for="item in layout"
				:key="item.i"
				:x="item.x"
				:y="item.y"
				:w="item.w"
				:h="item.h"
				:i="item.i"
				:is-editing="props.isDnd"
				@change-dnd-state="onChangeDndState"
				@change-resize-state="onChangeResizeState"
			>
				<template #state-calm>
					<current-dashboard :dashboard-item="getDashboardItemById(item.i)" />
				</template>
				<template #state-dnd>
					<ghost-move-component title="test" />
				</template>
				<template #state-resize>
					<placeholder-component />
				</template>
			</dashboard-grid-element>
		</grid-layout>
	</div>
</template>

<style scoped>
:deep(.vgl-layout) {
	opacity: 1 !important;
	transition: none;
	touch-action: none;

	--vgl-item-resizing-opacity: 100% !important;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
	user-select: none;
}

:deep(.vgl-item--placeholder .vgl-item__resizer) {
	display: none !important;
}

:deep(.vgl-item__resizer) {
	right: 15px !important;
	bottom: 10px !important;
	background-color: #000000 !important;
	opacity: 0;
}

:deep(.vgl-item--placeholder) {
	background-color: transparent !important;
	opacity: 1 !important;
}
</style>
