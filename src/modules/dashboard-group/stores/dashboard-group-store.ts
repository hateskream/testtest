import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
	type IWidget,
	type IDashboardTab,
	type IDashboard,
	type IWidgetPreset,
} from '../model';
import { ChangeActiveTab, CreateTab, GetDashboards, GetWidgetList, RenameTab } from '../api';

export const useDashboardGroupsStore = defineStore('dashboardGroups', () => {
	const activeDashboardId = ref('group-1');

	const preset = ref<IWidgetPreset[]>([]);

	const dashboards = ref<IDashboard[]>([]);

	const tabs = computed<IDashboardTab[]>(() =>
		dashboards.value.map(group => ({
			id: group.id,
			name: group.name,
			isActive: group.id === activeDashboardId.value,
		})),
	);

	const activeDashboard = computed<IDashboard | null>(() => {
		const group = dashboards.value.find(el => el.id === activeDashboardId.value);

		if (!group) {
			return null;
		}

		return group;
	});

	function onCreated() {
		loadDashboards();
		loadPreset();
	}

	async function loadDashboards() {
		const response = await GetDashboards({ userId: '1' });
		dashboards.value = response.dashboardGroup.dashboards;

		activeDashboardId.value = response.dashboardGroup.activeDashboardId;
	}

	async function loadPreset() {
		const response = await GetWidgetList();
		preset.value = response.widgets;
	}

	async function addTab() {
		const response = await CreateTab();

		dashboards.value.push(response.dashboard);
		activeDashboardId.value = response.activeDashboardId;
	}

	async function renameTab(tabId: string, newName: string) {
		const group = dashboards.value.find(g => g.id === tabId);
		if (group) {
			group.name = newName;
		}

		await RenameTab({ tabId, name: newName });
	}

	async function switchTab(tabId: string) {
		activeDashboardId.value = tabId;
		await ChangeActiveTab({ tabId });
	}

	function setNewStateInCurrentGroup(items: IWidget[]) {
		const group = dashboards.value.find(g => g.id === activeDashboardId.value);
		if (group) {
			group.widgets = items;
		}
	}

	onCreated();

	return {
		preset,
		dashboards,
		tabs,
		addTab,
		renameTab,
		switchTab,
		activeDashboard,
		setNewStateInCurrentGroup,
	};
});
