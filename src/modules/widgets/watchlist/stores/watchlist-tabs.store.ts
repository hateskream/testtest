import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IWatchlistTabUI, IWatchlistWidgetConfig } from '../model';
import { generateTimestampId } from '@/shared/lib';

export const useWatchlistTabsStore = defineStore('watchlistTabs', () => {
	const tabs = ref<IWatchlistTabUI[]>([]);
	const currentTabId = ref('');


	function addTab() {
		const newTab: IWatchlistTabUI = {
			id: generateTimestampId(),
			name: 'Personal',
			order: tabs.value.length,
			isActive: true,
			isEditing: true,
		};
		tabs.value.push(newTab);
		switchTab(newTab.id);
		startRenameState(newTab.id);
	}

	function renameTab(tabId: string, newName: string) {
		const tab = tabs.value.find(t => t.id === tabId);
		tab!.name = newName;
		stopRenameState();
	}

	const duplicateTab = (tabId: string) => {
		tabs.value.forEach(tab => {
			if (tab.id === tabId) {
				const newTab: IWatchlistTabUI = {
					id: generateTimestampId(),
					name: tab.name,
					order: 1,
					isActive: true,
					isEditing: false,
				};

				tabs.value.push(newTab);

				switchTab(newTab.id);
			}
		});
	};

	function startRenameState(tabId: string) {
		tabs.value.forEach(tab => {
			tab.isEditing = tab.id === tabId;
		});
	};

	function stopRenameState() {
		tabs.value.forEach(tab => {
			tab.isEditing = false;
		});
	}

	function switchTab(tabId: string) {
		tabs.value.forEach(tab => {
			tab.isActive = tab.id === tabId;
		});
		currentTabId.value = tabId;
	}


	function setupTabs(widgetConfig: IWatchlistWidgetConfig) {
		tabs.value = widgetConfig.tabs.map(tab => ({
			...tab,
			isActive: tab.id === widgetConfig.activeTabId,
			isEditing: false,
		}));

		currentTabId.value = widgetConfig.activeTabId;
	}
	return {
		setupTabs,
		currentTabId,
		tabs,
		addTab,
		renameTab,
		duplicateTab,
		switchTab,
		startRenameState,
		stopRenameState,
	};
});
