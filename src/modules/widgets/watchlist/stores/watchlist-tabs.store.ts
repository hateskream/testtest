import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IWatchlistTabUI, IWatchlistWidgetConfig } from '../model';
import { generateTimestampId } from '@/shared/lib';

export const useWatchlistTabsStore = defineStore('watchlistTabs', () => {
	const tabs = ref<IWatchlistTabUI[]>([]);
	const currentTabIdx = ref(0);


	function addTab() {
		const newTab: IWatchlistTabUI = {
			id: generateTimestampId(),
			name: 'Personal',
			order: 1,
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
		tabs.value.forEach((tab, idx) => {
			if (tab.id === tabId) {
				tab.isActive = true;
				currentTabIdx.value = idx;
			} else {
				tab.isActive = false;
			}
		});
	}


	function setupTabs(widgetConfig: IWatchlistWidgetConfig) {
		tabs.value = widgetConfig.tabs.map(tab => ({
			...tab,
			isActive: tab.id === widgetConfig.activeTabId,
			isEditing: false,
		}));

		currentTabIdx.value = tabs.value.findIndex(tab => tab.id === widgetConfig.activeTabId);
	}
	return {
		setupTabs,
		currentTabIdx,
		tabs,
		addTab,
		renameTab,
		duplicateTab,
		switchTab,
		startRenameState,
		stopRenameState,
	};
});
