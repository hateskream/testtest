<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';
import { GridLayout, type Layout } from 'grid-layout-plus';

import { useRebuildingGrid } from '../../../composables';
import type { IDashboardGroup, IDashboardItem, IPositionWithId } from '../../../model';

import DashboardGridElement from './dashboard-grid-element.vue';
import CurrentDashboard from '../dashboard/current-dashboard.vue';

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
	(e: 'update:modelValue', value: Layout): void;
	(e: 'setWrapper', value: HTMLDivElement): void;
	(e: 'setGridLayoutRef', value: InstanceType<typeof GridLayout>): void;
	(e: 'dropover'): void;
	(e: 'drop'): void;
}>();

let isUserInteracted = false;

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout> | null>(null);

const rawDashboards = computed((): IPositionWithId[] =>
	props.dashboards.items.map(el => ({ ...el.position, i: el.id })),
);

const { columnsNum, rowsNum } = toRefs(props);

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

function getDashboardItemById(id: string): IDashboardItem {
	const foundDashboard = props.dashboards.items.find(item => item.id === id);
	if (foundDashboard) {
		return foundDashboard;
	}

	throw new Error(`Dashboard with id ${id} not found`);
}

function updated(newLayout: Layout) {
	emit('update-is-show-grid-state', false);

	if (isUserInteracted) {
		emit('update:modelValue', newLayout);
		isUserInteracted = false;
	}
}

function onDragStart() {
	emit('update-is-show-grid-state', true);
}

function onDragEnd() {
	emit('update-is-show-grid-state', false);
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
				:is-dnd="isDnd"
				@is-drag="onDragStart"
				@is-drag-end="onDragEnd"
			>
				<current-dashboard :dashboard-item="getDashboardItemById(item.i)" />
			</dashboard-grid-element>
		</grid-layout>
	</div>
</template>

<style module="classes">
:global(.vgl-layout) {
	opacity: 1 !important;
	transition: none;
	touch-action: none;

	--vgl-item-resizing-opacity: 100% !important;
}
</style>
