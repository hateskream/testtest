import { defineStore } from 'pinia';
import { computed } from 'vue';

import { type IDashboardGroup, type IDashboardItem, type IPosition } from '../model';
import { useDashboardGroupsStore } from './dashboard-group-store';

export const useDashboardsStore = defineStore('dashboards', () => {
	const groupsStore = useDashboardGroupsStore();

	const activeGroup = computed<IDashboardGroup>(() => {
		const group = groupsStore.dashboardGroups.find(el => el.isActive);

		if (!group) {
			throw new Error('No active group');
		}

		return group;
	});

	const widgets = computed<IPosition[]>(() => activeGroup.value.items.map(item => item.position));

	function getDashboardById(id: string | number): IDashboardItem {
		const foundDashboard = activeGroup.value.items.find(item => item.id === id);
		if (foundDashboard) {
			return foundDashboard;
		}

		throw new Error(`Dashboard with id ${id} not found`);
	}

	return {
		activeGroup,
		widgets,
		getDashboardById,
	};
});
