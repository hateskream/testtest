import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { type IDashboardGroup, type IDashboardTab, DashboardItemType, WidgetType } from '../model';
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

	const activeGroup = computed<IDashboardGroup>(() => {
		const group = dashboardGroups.value.find(el => el.isActive);

		if (!group) {
			throw new Error('No active group');
		}

		return group;
	});

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

	return {
		dashboardGroups,
		tabs,
		addTab,
		renameTab,
		switchTab,
		activeGroup,
	};
});
