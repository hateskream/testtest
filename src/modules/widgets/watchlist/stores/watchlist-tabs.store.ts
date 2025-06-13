import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IWatchlistTab } from '../model';
import { generateTimestampId } from '@/shared/lib';

interface IWatchlistTabUI extends IWatchlistTab {
	isEditing?: boolean;
}

export const useWatchlistTabsStore = defineStore('watchlistTabs', () => {
	const tabs = ref<IWatchlistTabUI[]>([
		{
			id: '1',
			name: 'Favorites',
			isActive: true,
			isEditing: false,
			symbols: [],
		},
	]);


	function addTab() {
		const newTab: IWatchlistTabUI = {
			id: generateTimestampId(),
			name: 'Personal',
			isActive: false,
			symbols: [],
			isEditing: true,
		};
		tabs.value.push(newTab);
		switchTab(newTab.id);
		setRenameState(newTab.id);
	}

	function renameTab(tabId: string, newName: string) {
		const tab = tabs.value.find(t => t.id === tabId);
		tab!.name = newName;
		stopRenameState();
	}

	// TODO: Rename
	function setRenameState(tabId: string) {
		tabs.value.forEach(tab => {
			tab.isEditing = tab.id === tabId;
		});
	};

	// TODO: Rename
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
		switchTab,
		stopRenameState,
	};
});
