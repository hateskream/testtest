import { ref, watch } from 'vue';
import { useNow } from '@vueuse/core';

import { CalendarCountryIds, CalendarCategory, CalendarImpact } from '../model/calendar';
import { createStateQueries } from '@/shared/service/data-repo';
import { type ICalendarStorage, type CalendarStorageSchemaType, calendarStorageSchema } from '../model/storage';

interface IWidgetOptions {
	widgetId: string;
	isEphemeral: boolean;
	defaultStateType?: string;
}

interface IUseCalendarStateOptions {
	defaults?: {
		interval?: number;
		selectedCountries?: CalendarCountryIds[];
		selectedCategories?: CalendarCategory[];
		selectedImpacts?: CalendarImpact[];
	};
	widget: IWidgetOptions;
}

export function useCalendarState(options: IUseCalendarStateOptions) {
	const {
		widget,
		defaults = {},
	} = options;

	const {
		interval = 300_000,
		selectedCountries: defaultSelectedCountries = Object.values(CalendarCountryIds),
		selectedCategories: defaultSelectedCategories = Object.values(CalendarCategory),
		selectedImpacts: defaultSelectedImpacts = Object.values(CalendarImpact),
	} = defaults;

	const currentTime = useNow({ interval });

	const selectedCountries = ref<CalendarCountryIds[]>(defaultSelectedCountries);
	const selectedCategories = ref<CalendarCategory[]>(defaultSelectedCategories);
	const selectedImpacts = ref<CalendarImpact[]>(defaultSelectedImpacts);

	function resetAll() {
		selectedCountries.value = defaultSelectedCountries;
		selectedCategories.value = defaultSelectedCategories;
		selectedImpacts.value = defaultSelectedImpacts;
	}

	const { useStateMutation, useStateQuery } = createStateQueries<ICalendarStorage, CalendarStorageSchemaType>({
		isEphemeral: widget.isEphemeral,
		storageKey: '__CALENDAR__',
		isSaveChange: !widget.isEphemeral,
		getDefaultState: () => ({
			selectedCountries: defaultSelectedCountries,
			selectedCategories: defaultSelectedCategories,
			selectedImpacts: defaultSelectedImpacts,
		}),
		entityId: widget.widgetId,
		schema: calendarStorageSchema,
		hydrateFn: (s: CalendarStorageSchemaType): ICalendarStorage => s,
		rehydrateFn: (s: ICalendarStorage): CalendarStorageSchemaType => s,
		urlGet: '',
		urlSet: '',
	});

	const { data } = useStateQuery();
	const { mutate } = useStateMutation();

	watch([selectedCountries, selectedCategories, selectedImpacts], () => {
		mutate({
			selectedCountries: selectedCountries.value,
			selectedCategories: selectedCategories.value,
			selectedImpacts: selectedImpacts.value,
		});
	});

	watch(data, (value) => {
		if (!value) {
			return;
		}

		selectedCountries.value = value.selectedCountries;
		selectedCategories.value = value.selectedCategories;
		selectedImpacts.value = value.selectedImpacts;
	}, { deep: true, immediate: true });

	return {
		currentTime,
		selectedCountries,
		selectedCategories,
		selectedImpacts,
		resetAll,
	};
}
