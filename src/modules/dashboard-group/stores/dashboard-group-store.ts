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
			isEditing: false,
			items: INIT_DASHBOARDS,
			market: 'crypto',
		},
	]);

	const tabs = computed<IDashboardTab[]>(() =>
		dashboardGroups.value.map(group => ({
			id: group.id,
			name: group.name,
			isActive: group.isActive,
			isEditing: group.isEditing,
		})),
	);

	const activeGroup = computed<IDashboardGroup>(() => {
		const group = dashboardGroups.value.find(el => el.isActive);

		if (!group) {
			throw new Error('No active group');
		}

		return group;
	});

	function addTab(name?: string) {
		const newGroup: IDashboardGroup = {
			id: generateTimestampId(),
			name: name || 'Dashboard',
			isActive: false,
			items: [],
			market: 'crypto',
			isEditing: true,
		};
		dashboardGroups.value.push(newGroup);
		switchTab(newGroup.id);
		setRenameState(newGroup.id);
	}

	function renameTab(tabId: string, newName: string) {
		const group = dashboardGroups.value.find(g => g.id === tabId);
		if (group) {
			group.name = newName;
		}

		stopRenameState();
	}

	// TODO: Rename
	function setRenameState(tabId: string) {
		dashboardGroups.value.forEach(group => {
			if (group.id === tabId) {
				group.isEditing = true;
			}
		});
	};

	// TODO: Rename
	function stopRenameState() {
		dashboardGroups.value.forEach(group => {
			group.isEditing = false;
		});
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
		stopRenameState,
	};
});
