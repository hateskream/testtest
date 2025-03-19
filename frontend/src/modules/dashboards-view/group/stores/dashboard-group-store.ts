import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { type IDashboardGroup, type IDashboardTab, type IDashboardItem } from '../model';
import { generateTimestampId } from '@/shared/lib';

export const useDashboardGroupsStore = defineStore('dashboardGroups', () => {
	const dashboardGroups = ref<IDashboardGroup[]>([
		{
			id: 'group-1',
			name: 'Standart',
			isActive: true,
			items: [],
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

	const activeGroupId = computed(() => dashboardGroups.value.find(group => group.isActive)?.id);

	function addTab() {
		const newGroup: IDashboardGroup = {
			id: generateTimestampId(),
			name: `Tab ${dashboardGroups.value.length + 1}`,
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

	function addItemToGroup(groupId: string, item: IDashboardItem) {
		const group = dashboardGroups.value.find(g => g.id === groupId);
		if (group) {
			group.items.push(item);
		}
	}

	function moveItem(
		sourceGroupId: string,
		targetGroupId: string,
		itemId: string,
		targetIndex: number,
	) {
		const sourceGroup = dashboardGroups.value.find(g => g.id === sourceGroupId);
		const targetGroup = dashboardGroups.value.find(g => g.id === targetGroupId);
		if (!sourceGroup || !targetGroup) {
			return;
		}

		const itemIndex = sourceGroup.items.findIndex(i => i.id === itemId);
		if (itemIndex === -1) {
			return;
		}

		const [item] = sourceGroup.items.splice(itemIndex, 1);
		targetGroup.items.splice(targetIndex, 0, item);
	}

	return {
		dashboardGroups,
		tabs,
		activeGroupId,
		addTab,
		renameTab,
		switchTab,
		addItemToGroup,
		moveItem,
	};
});
