import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { compareStrings } from '@/shared/lib';

export const useWatchlistStore = defineStore('dashboards-watchlist', () => {
	const favorites = ref<string[]>([]);

	const isFavorites = ref<boolean>(true);

	const filterCategories = ref([
		{
			name: 'Crypto',
			value: 'crypto',
			isSelect: true,
		},
		{
			name: 'Stock',
			value: 'stock',
			isSelect: false,
		},
		{
			name: 'Forex',
			value: 'forex',
			isSelect: false,
		},
		{
			name: 'Commodity',
			value: 'commodity',
			isSelect: false,
		},
	]);

	const activeFilterCategory = computed(() => filterCategories.value.find(item => item.isSelect));

	function toggleFilterCategory(value: string) {
		filterCategories.value = filterCategories.value.map(item => {
			if (compareStrings(item.value, value)) {
				return {
					...item,
					isSelect: !item.isSelect,
				};
			}

			return { ...item, isSelect: false };
		});
	}

	function addToFavorites(id: string) {
		favorites.value.push(id);
	}

	function removeFromFavorites(id: string) {
		const idx = favorites.value.findIndex(item => item === id);

		if (idx > -1) {
			favorites.value.splice(idx, 1);
		}
	}

	function toggleFavorites() {
		isFavorites.value = !isFavorites.value;
	}

	function toggleFavoriteItem(id: string) {
		if (favorites.value.includes(id)) {
			removeFromFavorites(id);
		} else {
			addToFavorites(id);
		}
	}

	return {
		favorites,
		isFavorites,
		filterCategories,
		activeFilterCategory,
		toggleFilterCategory,
		addToFavorites,
		removeFromFavorites,
		toggleFavorites,
		toggleFavoriteItem,
	};
});