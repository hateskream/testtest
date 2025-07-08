import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
	type IWidget,
	type IDashboardTab,
	type IDashboard,
	type IWidgetPreset,
	ALL_DASHBOARDS,
} from '../model';
import { generateTimestampId } from '@/shared/lib';
import { GetDashboards } from '../api';

export const useDashboardGroupsStore = defineStore('dashboardGroups', () => {
	const activeDashboardId = ref('group-1');

	const preset = ref<IWidgetPreset[]>(ALL_DASHBOARDS);

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
	}

	async function loadDashboards() {
		const response = await GetDashboards({ userId: '1' });
		dashboards.value = response.dashboardGroup.dashboards;

		activeDashboardId.value = response.dashboardGroup.activeDashboardId;
	}

	function addTab(name?: string) {
		const newDashboard: IDashboard = {
			id: generateTimestampId(),
			name: name || 'Dashboard',
			order: 0,
			widgets: [],
		};
		dashboards.value.push(newDashboard);
		switchTab(newDashboard.id);
	}

	function renameTab(tabId: string, newName: string) {
		const group = dashboards.value.find(g => g.id === tabId);
		if (group) {
			group.name = newName;
		}
	}

	function switchTab(tabId: string) {
		activeDashboardId.value = tabId;
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
