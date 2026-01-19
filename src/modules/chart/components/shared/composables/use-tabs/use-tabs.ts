import { ref, computed, toValue, type MaybeRefOrGetter, watch } from 'vue';

export interface ITabItem {
	id: string;
	title: string;
}

export function useTabs(tabs: MaybeRefOrGetter<ITabItem[]>) {
	const tabList = computed(
		() => toValue(tabs),
	);

	const activeTab = ref<string | undefined>(undefined);

	watch(tabList, (list) => {
		if (!activeTab.value && list.length > 0) {
			activeTab.value = list[0].id;
		}
	}, { immediate: true });

	function setActiveTab(id: string) {
		const tabExists = tabList.value.some(tab => tab.id === id);

		if (tabExists) {
			activeTab.value = id;
		}
	}

	const activeTabItem = computed(() =>
		tabList.value.find(tab => tab.id === activeTab.value),
	);

	const tabIds = computed(
		() => tabList.value.map(tab => tab.id),
	);

	return {
		activeTab,
		activeTabItem,
		tabList,
		tabIds,
		setActiveTab,
	};
}
