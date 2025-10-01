<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';

import type { IDashboard } from '../model';
import type { IPosition, WidgetType } from '@/modules/dashboard-group/core';
import type { IWidgetState } from '@/modules/dashboard-group/core';
import { useDelayedLoading } from '@/shared/composables';

import GridComponent from './grid-component.vue';

const GAP = 20;
const GAP_PX = GAP + 'px';

interface IGridSliderProps {
	activeDashboardId: string;
	dashboards: IDashboard[];
	rowsNum: number;
	columnsNum: number;
	rowHeight: number;
	columnWidth: number;
	rowNumGrid: number;
}

const props = defineProps<IGridSliderProps>();

const emit = defineEmits<{
	(e: 'add-widget', type: WidgetType, position: IPosition, widgetsState: IWidgetState[]): void;
	(e: 'delete-widget', widgetId: string, widgetsState: IWidgetState[]): void;
	(e: 'change-dashboard-state', widgetsState: IWidgetState[]): void;
	(e: 'is-edit', value: boolean): void;
}>();

const { loading } = useDelayedLoading();

const { width } = useElementSize(useTemplateRef('rootRef'));

const activeIndex = computed(() => {
	return props.dashboards.findIndex((dashboard) => dashboard.id === props.activeDashboardId);
});

const sliderStyle = computed(() => {
	let translateX = (width.value + GAP) * activeIndex.value;

	return {
		transform: `translateX(${-translateX}px)`,
		transition: loading.value ? 'none' : `transform ${300}ms`,
	};
});

function emitAddWidget(type: WidgetType, position: IPosition, widgetsState: IWidgetState[]) {
	emit('add-widget', type, position, widgetsState);
}

function emitDeleteWidget(widgetId: string, widgetsState: IWidgetState[]) {
	emit('delete-widget', widgetId, widgetsState);
}
</script>

<template>
	<div
		ref="rootRef"
		class="root-s"
	>
		<div class="wrapper-s">
			<div
				:style="sliderStyle"
				class="list-s"
			>
				<grid-component
					v-for="dashboard in props.dashboards"
					:key="dashboard.id"
					:id="dashboard.id"
					data-test="123"
					:active-id="props.activeDashboardId"
					:widgets="dashboard.widgets"
					:rows-num="props.rowsNum"
					:columns-num="props.columnsNum"
					:row-height="props.rowHeight"
					:column-width="props.columnWidth"
					:row-num-grid="props.rowNumGrid"
					:style="
						{width : width + 'px'}
					"
					@add-widget="emitAddWidget"
					@delete-widget="emitDeleteWidget"
					@change-dashboard-state="emit('change-dashboard-state', $event)"
					@is-edit="emit('is-edit', $event)"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
.root-s {
	display: flex;
	justify-content: center;
	width: 100%;
	height: 100%;
}

.wrapper-s {
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.list-s {
	display: flex;
	width: max-content;
	height: 100%;
	gap: v-bind(GAP_PX);
}
</style>
