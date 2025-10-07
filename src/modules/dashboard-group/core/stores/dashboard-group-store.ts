import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
	type IDashboardTab,
	// type IDashboard,
	WidgetType,
	type IPosition,
	type IWidgetState,
	allWidgets,
	type IDashboardGroup,
	type IWidget,
	createDashboardGroup,
	getDashboardsByColNum,
	addNewDashboard,
	renameDashboard,
	changeActiveDashboard,
	changeWidgetsState,
	deleteWidget as deleteWidgetModel,
	addWidget as addWidgetModel,
} from '../new-model';

export interface IDashboard {
	id: string;
	name: string;
	order: number;
	widgets: IWidget[];
}

export const useDashboardGroupsStore = defineStore('dashboardGroups', () => {
	const preset = allWidgets();

	const state = ref<IDashboardGroup>({
		activeDashboardId: '',
		dashboards: [],
		activeColNum: 0,
	});

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
		getDashboardsByColNum(state.value).find(el => el.id === activeDashboardId.value) || null,
	);

	async function loadDashboards(cn: number) {
		state.value = createDashboardGroup(cn);
	}

	async function addTab() {
		state.value = addNewDashboard(state.value);
	}

	async function renameTab(tabId: string, newName: string) {
		state.value = renameDashboard(state.value, tabId, newName);
	}

	async function switchTab(tabId: string) {
		state.value = changeActiveDashboard(state.value, tabId);
	}

	async function changeDashboardState(widgetsState: IWidgetState[]) {
		state.value = changeWidgetsState(state.value, widgetsState);
	}

	async function deleteWidget(widgetId: string, widgetsState: IWidgetState[]) {
		state.value = deleteWidgetModel(state.value, widgetId, widgetsState);
	}

	async function addWidget(type: WidgetType, position: IPosition, widgetsState: IWidgetState[]) {
		state.value = addWidgetModel(state.value, type, position, widgetsState);
	}

	return {
		activeDashboardId,
		preset,
		dashboards,
		tabs,
		addTab,
		renameTab,
		switchTab,
		activeDashboard,
		addWidget,
		deleteWidget,
		changeDashboardState,
		loadDashboards,
	};
});

// export const useDashboardGroupsStore = defineStore('dashboardGroups', () => {
// 	const activeDashboardId = ref('group-1');

// 	const preset = ref<IWidgetPreset[]>([]);

// 	const dashboards = ref<IDashboard[]>([]);

// 	const tabs = computed<IDashboardTab[]>(() =>
// 		dashboards.value.map(group => ({
// 			id: group.id,
// 			name: group.name,
// 			isActive: group.id === activeDashboardId.value,
// 		})),
// 	);

// 	const activeDashboard = computed<IDashboard | null>(() => {
// 		const group = dashboards.value.find(el => el.id === activeDashboardId.value);

// 		if (!group) {
// 			return null;
// 		}

// 		return group;
// 	});

// 	function onCreated() {
// 		loadPreset();
// 	}

// 	async function loadDashboards(colNum: number) {
// 		const response = await GetDashboards({ userId: '1', colNum: colNum });

// 		dashboards.value = response.dashboardGroup.dashboards;
// 		activeDashboardId.value = response.dashboardGroup.activeDashboardId;
// 	}

// 	async function loadPreset() {
// 		const response = await GetWidgetList();
// 		preset.value = response.widgets;
// 	}

// 	async function addTab() {
// 		const response = await CreateTab();

// 		dashboards.value.push(response.dashboard);
// 		activeDashboardId.value = response.activeDashboardId;
// 	}

// 	async function renameTab(tabId: string, newName: string) {
// 		const group = dashboards.value.find(g => g.id === tabId);
// 		if (group) {
// 			group.name = newName;
// 		}

// 		await RenameTab({ tabId, name: newName });
// 	}

// 	async function switchTab(tabId: string) {
// 		activeDashboardId.value = tabId;
// 		await ChangeActiveTab({ tabId });
// 	}

// 	async function changeDashboardState(widgetsState: IWidgetState[]) {
// 		dashboards.value = getNewState(widgetsState);

// 		await ChangeDashboardState({ dashboardState: widgetsState });
// 	}

// 	async function deleteWidget(widgetId: string, widgetsState: IWidgetState[]) {
// 		dashboards.value = dashboards.value.map(d => ({
// 			...d,
// 			widgets: d.widgets.filter(w => w.id !== widgetId),
// 		}));

// 		dashboards.value = getNewState(widgetsState);

// 		await DeleteWidget({ widgetId, dashboardState: widgetsState });
// 	}

// 	async function addWidget(type: WidgetType, position: IPosition, widgetsState: IWidgetState[]) {
// 		dashboards.value = getNewState(widgetsState);

// 		const { widget: newWidget } = await AddWidget({ widgetType: type, position, widgetsState });

// 		const group = dashboards.value.find(g => g.id === activeDashboardId.value);
// 		if (group) {
// 			group.widgets.push(newWidget);
// 		}
// 	}

// 	function getNewState(widgetsState: IWidgetState[]) {
// 		return dashboards.value.map(d => ({
// 			...d,
// 			widgets: d.widgets.map(w => ({
// 				...w,
// 				position: widgetsState
// 					.find(ws => ws.id === w.id)
// 					?.position || w.position,
// 			})),
// 		}));
// 	}

// 	onCreated();

// 	return {
// 		activeDashboardId,
// 		preset,
// 		dashboards,
// 		tabs,
// 		addTab,
// 		renameTab,
// 		switchTab,
// 		activeDashboard,
// 		addWidget,
// 		deleteWidget,
// 		changeDashboardState,
// 		loadDashboards,
// 	};
// });
