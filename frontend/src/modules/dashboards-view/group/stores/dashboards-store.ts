import { defineStore } from 'pinia';
import { computed } from 'vue';

import { useDashboardGroupsStore } from './dashboard-group-store';
import type { IDashboardGroup, DashboardType, IDashboardInstance } from '../model';
import { generateTimestampId } from '@/shared/lib';

export const useDashboardsStore = defineStore('dashboards', () => {
	const groupsStore = useDashboardGroupsStore();

	const activeGroup = computed<IDashboardGroup | undefined>(() =>
		groupsStore.dashboardGroups.find(group => group.isActive),
	);

	function addDashboard(type: DashboardType) {
		const targetGroupId = activeGroup.value?.id;

		if (!targetGroupId) {
			return;
		}

		const group = groupsStore.dashboardGroups.find(g => g.id === targetGroupId);
		if (group) {
			const newDashboard: IDashboardInstance = {
				id: generateTimestampId(),
				type,
				position: { x: 0, y: 0, w: 2, h: 2 },
			};
			group.dashboards.push(newDashboard);
		}
	}

	return {
		activeGroup,
		addDashboard,
	};
});
