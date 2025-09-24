import { useLocalStorage } from '@vueuse/core';

export function useFavoritesState() {
	const eventBoardFavorites = useLocalStorage<string[]>('calendar-event-board-favorites', [], {
		deep: true,
	});

	function toggleFavorite(id: string) {
		if (eventBoardFavorites.value.includes(id)) {
			eventBoardFavorites.value.splice(eventBoardFavorites.value.indexOf(id), 1);
		} else {
			eventBoardFavorites.value.push(id);
		}
	}

	return {
		eventBoardFavorites,
		toggleFavorite,
	};
}
