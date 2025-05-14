import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
	type IDashboardFolder,
	type IDashboardGroup,
	type IDashboardInstance,
	type IDashboardStack,
	type IDashboardTab,
	INIT_DASHBOARDS,
} from '../model';
import { generateTimestampId } from '@/shared/lib';

export const useDashboardGroupsStore = defineStore('dashboardGroups', () => {
	const dashboardGroups = ref<IDashboardGroup[]>([
		{
			id: 'group-1',
			name: 'Standart',
			isActive: true,
			items: INIT_DASHBOARDS,
			market: 'crypto',
		},
	]);

	const tabs = computed<IDashboardTab[]>(() =>
		dashboardGroups.value.map(group => ({
			id: group.id,
			name: group.name,
			isActive: group.isActive,
		})),
	);

	const activeGroup = computed<IDashboardGroup>(() => {
		const group = dashboardGroups.value.find(el => el.isActive);

		if (!group) {
			throw new Error('No active group');
		}

		return group;
	});

	const activeGroupId = computed(() => activeGroup.value.id);

	function addTab() {
		const newGroup: IDashboardGroup = {
			id: generateTimestampId(),
			name: 'Dashboard',
			isActive: false,
			items: [],
			market: 'crypto',
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

	function setNewStateInCurrentGroup(items: (IDashboardInstance | IDashboardFolder | IDashboardStack)[]) {
		const group = dashboardGroups.value.find(g => g.isActive);

		if (group) {
			group.items = items;
		}
	}

	return {
		dashboardGroups,
		tabs,
		addTab,
		renameTab,
		switchTab,
		activeGroup,
		setNewStateInCurrentGroup,
	};
});
