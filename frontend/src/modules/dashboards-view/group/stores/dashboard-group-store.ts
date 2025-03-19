import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { type IDashboardGroup, type IDashboardTab } from '../model';
import { generateTimestampId } from '@/shared/lib';

export const useDashboardGroupsStore = defineStore('dashboardGroups', () => {
	const dashboardGroups = ref<IDashboardGroup[]>([
		{
			id: 'group-1',
			name: 'Standart',
			isActive: true,
			dashboards: [],
		},
	]);

	const tabs = computed<IDashboardTab[]>(() =>
		dashboardGroups.value.map(group => ({
			id: group.id,
			name: group.name,
			isActive: group.isActive,
		})),
	);

	const activeGroupId = computed(() => dashboardGroups.value.find(group => group.isActive)?.id);

	function addTab() {
		const newGroup: IDashboardGroup = {
			id: generateTimestampId(),
			name: `Tab ${dashboardGroups.value.length + 1}`,
			isActive: false,
			dashboards: [],
		};
		dashboardGroups.value.push(newGroup);
		switchTab(newGroup.id);
	}

	function renameTab(tabId: string, newName: string) {
		const group = dashboardGroups.value.find(g => g.id === tabId);
		if (group) {
			group.name = newName;
		}
	}

	function switchTab(tabId: string) {
		dashboardGroups.value.forEach(group => {
			group.isActive = group.id === tabId;
		});
	}

	return {
		dashboardGroups,
		tabs,
		activeGroupId,
		addTab,
		renameTab,
		switchTab,
	};
});
