import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
	type IDashboardGroup,
	type IDashboardTab,
	DashboardItemType,
	WidgetType,
	type IDashboardInstance,
	type IDashboardFolder,
	type IDashboardCollection,
} from '../model';
import { generateTimestampId } from '@/shared/lib';

export const useDashboardGroupsStore = defineStore('dashboardGroups', () => {
	const dashboardGroups = ref<IDashboardGroup[]>([
		{
			id: 'group-1',
			name: 'Standart',
			isActive: true,
			items: [
				{
					type: DashboardItemType.Instance,
					id: 0,
					name: 'Hot Markets',
					dashboardType: WidgetType.HotMarkets,
					position: { x: 0, y: 0, w: 2, h: 4 },
				},
				{
					type: DashboardItemType.Instance,
					id: 1,
					name: 'Fear & Greed',
					dashboardType: WidgetType.FearGreed,
					position: { x: 2, y: 0, w: 2, h: 4 },
				},
				{
					type: DashboardItemType.Instance,
					id: 2,
					name: 'Price',
					dashboardType: WidgetType.Price,
					position: { x: 4, y: 0, w: 2, h: 4 },
				},
				{
					type: DashboardItemType.Instance,
					id: 3,
					name: 'Market',
					dashboardType: WidgetType.Market,
					position: { x: 0, y: 4, w: 3, h: 4 },
				},
				{
					type: DashboardItemType.Instance,
					id: 4,
					name: 'News',
					dashboardType: WidgetType.News,
					position: { x: 3, y: 4, w: 3, h: 4 },
				},
			],
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

	function addItemToGroup(
		groupId: string,
		item: IDashboardInstance | IDashboardFolder | IDashboardCollection,
	) {
		const group = dashboardGroups.value.find(g => g.id === groupId);
		if (group) {
			group.items.push(item);
		}
	}

	return {
		dashboardGroups,
		tabs,
		activeGroupId,
		addTab,
		renameTab,
		switchTab,
		addItemToGroup,
	};
});
