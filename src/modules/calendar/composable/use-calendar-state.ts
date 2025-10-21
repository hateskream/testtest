import { useNow } from '@vueuse/core';
import { computed, reactive, ref, watch } from 'vue';

import { useWatchlist } from '@/modules/watchlist';
import {
	addDays,
	getEndOfWeek,
	getStartOfWeek,
	type IEventBoardRange,
	type IUseToolbarStateOptions,
	type IWeeklyDayInfo,
	toUtcIsoDate,
	toWeekDays,
	useDailyCalendar,
	useEventBoard,
	useFavoritesState,
	useToolbar,
} from '@/modules/calendar';
import { getRehydrated } from '@/modules/calendar/services';

export interface IUseCalendarStateOptions {
	toolbar: IUseToolbarStateOptions;
}

export function useCalendarState(options: IUseCalendarStateOptions) {
	const now = useNow({ interval: 60_000 });
	const locale = 'en-US';

	const baseDate = ref(now.value);
	const selectedDate = ref(now.value);

	const { watchlists } = useWatchlist();
	const {
		state: toolbar,
		marketId,
		impact,
		eventType,
		watchlistId,
		watchlistSection,
		getToolbarDefaultState,
	} = useToolbar(options.toolbar);
	const { eventBoardFavorites, toggleFavorite } = useFavoritesState();

	const weekRange = reactive<IEventBoardRange>({
		from: toUtcIsoDate(getStartOfWeek(baseDate.value)),
		to: toUtcIsoDate(getEndOfWeek(baseDate.value)),
	});

	const {
		dailyCalendar,
		isDailyCalendarLoading,
		isError: isDailyCalendarError,
		refetch: refetchDailyCalendar,
	} = useDailyCalendar({
		from: () => toUtcIsoDate(getStartOfWeek(baseDate.value)),
		to: () => toUtcIsoDate(addDays(getEndOfWeek(baseDate.value), 7)),
	});

	function resetWeek() {
		baseDate.value = now.value;
		selectedDate.value = now.value;
	}

	function resetAll() {
		resetWeek();
		toolbar.value = getRehydrated(getToolbarDefaultState());
	}

	watch(baseDate, newValue => {
		weekRange.from = toUtcIsoDate(getStartOfWeek(newValue));
		weekRange.to = toUtcIsoDate(getEndOfWeek(newValue));
	});

	const watchlistSelectedSections = computed(() => {
		if (!toolbar.value.watchlistSection) {
			return watchlists.value
				.find(v => v.id === toolbar.value.watchlistId)
				?.sections.flatMap(v => v.tickerIds) || [];
		}

		return watchlists.value
			.find(v => v.id === toolbar.value.watchlistId)
			?.sections.find(v => v.name === toolbar.value.watchlistSection)
			?.tickerIds || [];
	});

	const filters = computed(() => ({
		range: weekRange,
		filters: {
			marketId: Array.from(toolbar.value.marketId),
			impact: Array.from(toolbar.value.impact),
			eventType: Array.from(toolbar.value.eventType),
			watchlist: Array.from(watchlistSelectedSections.value),
		},
	}));

	const {
		eventBoard,
		isLoading: isEventBoardLoading,
		isError: isEventBoardError,
		refetch: refetchEventBoard,
	} = useEventBoard(filters);

	const weekDays = computed<IWeeklyDayInfo[]>(() => {
		if (isDailyCalendarLoading.value || !dailyCalendar.value) {
			return [];
		}

		return toWeekDays(
			dailyCalendar.value,
			baseDate.value,
			locale,
			eventBoard.value,
			eventBoardFavorites.value,
		);
	});

	function setSelected(date: Date) {
		selectedDate.value = new Date(date);
		baseDate.value = new Date(date);
	}

	function prevWeek() {
		const d = new Date(baseDate.value);
		d.setDate(d.getDate() - 7);

		baseDate.value = d;
	}

	function nextWeek() {
		const d = new Date(baseDate.value);
		d.setDate(d.getDate() + 7);

		baseDate.value = d;
	}

	const isError = computed(() =>
		isEventBoardError.value || isDailyCalendarError.value,
	);

	async function refetch() {
		if (isDailyCalendarError.value) {
			await refetchDailyCalendar();
		}
		if (isEventBoardError.value) {
			await refetchEventBoard();
		}
	}

	return {
		locale,

		isDailyCalendarLoading,
		isEventBoardLoading,

		now,
		baseDate,
		selectedDate,
		weekRange,
		resetWeek,
		resetAll,

		toolbar,
		dailyCalendar,
		watchlists,
		eventBoard,
		eventBoardFavorites,
		toggleFavorite,
		weekDays,

		marketId,
		impact,
		eventType,
		watchlistId,
		watchlistSection,

		isError,
		setSelected,
		prevWeek,
		nextWeek,

		refetch,
	};
}
