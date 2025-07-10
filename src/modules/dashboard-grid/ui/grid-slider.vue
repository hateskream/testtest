<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, useTemplateRef } from 'vue';

import type { IDashboard } from '../model';
import type { IPosition, WidgetType } from '@/modules/dashboard-group';
import type { IWidgetState } from '@/modules/dashboard-group/model';

import GridComponent from './grid-component.vue';

const GAP = 20;
const GAP_PX = GAP + 'px';

type CallbackType = (width: number) => void;

let disconnectObserverFunc: () => void = () => {};

let isInit = false;

interface IGridSliderProps {
	activeDashboardId: string;
	dashboards: IDashboard[];
}

const props = defineProps<IGridSliderProps>();

const emit = defineEmits<{
	(e: 'add-widget', type: WidgetType, position: IPosition, widgetsState: IWidgetState[]): void;
	(e: 'delete-widget', widgetId: string, widgetsState: IWidgetState[]): void;
	(e: 'change-dashboard-state', widgetsState: IWidgetState[]): void;
	(e: 'is-edit', value: boolean): void;
}>();

const rootRef = useTemplateRef('rootRef');

const state = reactive({
	dashboardMountWidth: 0,
	dashboardMutedWidth: 0,
});

const activeIndex = computed(() => {
	return props.dashboards.findIndex((dashboard) => dashboard.id === props.activeDashboardId);
});

const sliderStyle = computed(() => {
	let translateX = (state.dashboardMountWidth + GAP) * activeIndex.value;

	return {
		transform: `translateX(${-translateX}px)`,
		transition: `transform ${300}ms`,
	};
});

onMounted(() => {
	if (!rootRef.value) {
		return;
	}

	const width = rootRef.value.clientWidth;

	state.dashboardMountWidth = width;
	state.dashboardMutedWidth = width;

	disconnectObserverFunc = createResizeObserver(rootRef.value, mutWidth => {
		if (!isInit && mutWidth !== width) {
			state.dashboardMutedWidth = mutWidth;
			isInit = true;
		}
	});
});

onUnmounted(disconnectObserverFunc);

function createResizeObserver(element: HTMLElement, setterCallback: CallbackType) {
	const observer = new ResizeObserver(() => {
		setterCallback(element.clientWidth);
	});

	observer.observe(element);
	return () => observer.disconnect();
}

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
				v-if="props.dashboards.length"
				:style="sliderStyle"
				class="list-s"
			>
				<grid-component
					v-for="dashboard in props.dashboards"
					:key="dashboard.id"
					:widgets="dashboard.widgets"
					:style="
						dashboard.id === props.activeDashboardId && dashboard.widgets.length === 0
							? {width : state.dashboardMutedWidth + 'px'}
							: {width : state.dashboardMountWidth + 'px'}
					"
					@add-widget="emitAddWidget"
					@delete-widget="emitDeleteWidget"
					@change-dashboard-state="emit('change-dashboard-state', $event)"
					@is-edit="emit('is-edit', $event)"
				>
					<template #dashboard-content="{ dashboardItem, meta }">
						<slot
							name="dashboard-content"
							:dashboard-item="dashboardItem"
							:meta="meta"
						/>
					</template>
				</grid-component>
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
