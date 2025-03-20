import { defineStore } from 'pinia';
import { computed } from 'vue';

import { type IDashboardGroup } from '../model';
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

	return {
		activeGroup,
	};
});
