import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IWatchlistTab } from '../model';
import { generateTimestampId } from '@/shared/lib';


export const useWatchlistTabsStore = defineStore('watchlistTabs', () => {
	const tabs = ref<IWatchlistTab[]>([
		{
			id: '1',
			name: 'Favorites',
			isActive: true,
			isEditing: false,
			symbols: [],
		},
	]);


	function addTab() {
		const newTab: IWatchlistTab = {
			id: generateTimestampId(),
			name: 'Personal',
			isActive: true,
			isEditing: true,
			symbols: [],
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
				const newTab: IWatchlistTab = {
					id: generateTimestampId(),
					name: tab.name,
					isActive: true,
					isEditing: false,
					symbols: tab.symbols,
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
	}

	return {
		tabs,
		addTab,
		renameTab,
		duplicateTab,
		switchTab,
		startRenameState,
		stopRenameState,
	};
});
