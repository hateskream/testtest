import { computed, nextTick, ref, watch, type Ref } from 'vue';
import { z } from 'zod';

import {
	type IDashboardTab,
	WidgetType,
	type IPosition,
	type IWidgetState,
	allWidgets,
	type IDashboardGroup,
	createDashboardGroup,
	getDashboardsByColNum,
	addNewDashboard,
	renameDashboard,
	changeActiveDashboard,
	changeWidgetsState,
	deleteWidget as deleteWidgetModel,
	addWidget as addWidgetModel,
	type IDashboard,
	rehydrateWidget,
	changeActiveColumnNum,
	mapToLayoutItem,
	moveTo as moveToModel,
	deleteDashboard as deleteDashboardModel,
} from '../model';
import { createStateQueries } from '@/shared/service/data-repo';

const PositionSchema = z.object({
	x: z.number(),
	y: z.number(),
	w: z.number(),
	h: z.number(),
});

export type Position = z.infer<typeof PositionSchema>;

const WidgetSchema = z.object({
	id: z.string(),
	type: z.string(),
	position: PositionSchema,
	defaultStateType: z.string(),
});

export type Widget = z.infer<typeof WidgetSchema>;

const DashboardSchema = z.object({
	id: z.string(),
	name: z.string(),
	order: z.number(),
	activeColNum: z.number(),
	layout:  z.record(z.array(WidgetSchema)),
});

export type Dashboard = z.infer<typeof DashboardSchema>;

export const DashboardGroupSchema = z.object({
	activeDashboardId: z.string(),
	dashboards: z.array(DashboardSchema),
});

export type DashboardGroup = z.infer<typeof DashboardGroupSchema>;

export function useDashboardGroup(colNum: Ref<number>) {
	let isUserInteraction: boolean = true;

	const {
		useStateQuery,
		useStateMutation,
		undo,
	} = createStateQueries<IDashboardGroup, DashboardGroup>({
		storageKey: '__DASHBOARD_GROUP__',
		isSaveChange: true,
		getDefaultState: () => createDashboardGroup(colNum.value),
		entityId: 'dashboard-group',
		schema: DashboardGroupSchema,
		hydrateFn: s => hydrate(s),
		rehydrateFn: s => rehydrate(s, colNum.value),
		urlGet: '',
		urlSet: '',
		saveHistory: true,
	});

	const { data: dashboardGroupData } = useStateQuery();
	const { mutate } = useStateMutation();

	const preset = allWidgets();

	const state = ref<IDashboardGroup>({
		activeDashboardId: '',
		dashboards: [],
		activeColNum: 0,
	});

	const isUndo = ref(false);

	const activeDashboardId = computed(() => state.value.activeDashboardId);

	const dashboards = computed(() => getDashboardsByColNum(state.value));

	const tabs = computed<IDashboardTab[]>(() =>
		dashboards.value.map(group => ({
			id: group.id,
			name: group.name,
			isActive: group.id === activeDashboardId.value,
		})),
	);

	const activeDashboard = computed<IDashboard | null>(() =>
		dashboards.value.find(el => el.id === activeDashboardId.value) || null,
	);

	watch(dashboardGroupData, newState => {
		if (newState) {
			state.value = { ...newState };
		}
	}, { immediate: true });

	watch(state, (newState, oldState) => {
		if (newState.activeColNum === 0) {
			return;
		}

		if (JSON.stringify(newState) === JSON.stringify(oldState)) {
			return;
		}

		if (!isUserInteraction) {
			nextTick(() => {
				isUserInteraction = true;
			});
			return;
		}

		mutate(newState);

	}, { deep: true });

	watch(colNum, (newColNum, oldColNum) => {
		state.value = changeActiveColumnNum(state.value, newColNum);
		if (!oldColNum) {
			return;
		}
		isUserInteraction = false;
	}, { immediate: true });

	function addTab() {
		state.value = addNewDashboard(state.value);
	}

	function renameTab(tabId: string, newName: string) {
		state.value = renameDashboard(state.value, tabId, newName);
	}

	function switchTab(tabId: string) {
		state.value = changeActiveDashboard(state.value, tabId);
	}

	function changeDashboardState(widgetsState: IWidgetState[]) {
		state.value = changeWidgetsState(state.value, widgetsState);
	}

	function deleteWidget(widgetId: string, widgetsState: IWidgetState[]) {
		state.value = deleteWidgetModel(state.value, widgetId, widgetsState);
	}

	function addWidget(type: WidgetType, position: IPosition, widgetsState: IWidgetState[]) {
		state.value = addWidgetModel(state.value, type, position, widgetsState);
	}

	function moveTo(type: WidgetType, widgetId: string, position: IPosition, dashboardId: string) {
		const { widgets } = dashboards.value.find(d => d.id === dashboardId) || {};
		if (!widgets) {
			return;
		}

		const layout = mapToLayoutItem(widgets);

		const newPosition = moveToModel(layout, { i: widgetId, ...position });

		state.value = addWidgetModel(state.value, type, newPosition, widgets, dashboardId);
	}

	function deleteDashboard(id: string) {
		state.value = deleteDashboardModel(state.value, id);
	}

	function undoDeleteTab() {
		undo();

		if (dashboards.value.length < 2) {
			return;
		}

		isUndo.value = true;
		nextTick(() => {
			isUndo.value = false;
		});
	}

	return {
		activeDashboardId,
		preset,
		dashboards,
		tabs,
		isUndo,
		addTab,
		renameTab,
		switchTab,
		activeDashboard,
		addWidget,
		deleteWidget,
		changeDashboardState,
		moveTo,
		deleteDashboard,
		undoDeleteTab,
	};
}

function rehydrate(data: DashboardGroup, colNum: number): IDashboardGroup {
	return {
		activeDashboardId: data.activeDashboardId,
		activeColNum: colNum,
		dashboards: data.dashboards.map(dashboard => ({
			id: dashboard.id,
			name: dashboard.name,
			order: dashboard.order,
			activeColNum: dashboard.activeColNum,
			layout: Object.fromEntries(
				Object
					.entries(dashboard.layout)
					.map(([key, widgets]) => [
						Number(key),
						widgets.map(widget =>
							rehydrateWidget(widget.id, widget.type, widget.position, widget.defaultStateType),
						),
					]),
			),
		})),
	};
}

function hydrate(data: IDashboardGroup): DashboardGroup {
	return {
		activeDashboardId: data.activeDashboardId,
		dashboards: data.dashboards.map(d => ({
			id: d.id,
			name: d.name,
			order: d.order,
			activeColNum: d.activeColNum,
			layout: Object.fromEntries(
				Object.entries(d.layout).map(([key, widgets]) => [
					Number(key),
					widgets.map(widget => ({
						id: widget.id,
						type: widget.widgetType,
						position: widget.position,
						defaultStateType: widget.defaultStateType,
					})),
				]),
			),
		})),
	};
}
