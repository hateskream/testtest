import { ref, computed, type MaybeRef, unref } from 'vue';

interface ITabItem {
	id: string;
	title: string;
}

export function useTabs(tabs: MaybeRef<ITabItem[]>) {
	const tabList = computed(() => unref(tabs));
	const activeTab = ref<string>(tabList.value[0]?.id || '');

	const setActiveTab = (id: string) => {
		const tabExists = tabList.value.some(tab => tab.id === id);
		if (tabExists) {
			activeTab.value = id;
		}
	};


	const activeTabItem = computed(() =>
		tabList.value.find(tab => tab.id === activeTab.value),
	);


	const tabIds = computed(() => tabList.value.map(tab => tab.id));

	return {
		activeTab,
		activeTabItem,
		tabList,
		tabIds,
		setActiveTab,
	};
}
