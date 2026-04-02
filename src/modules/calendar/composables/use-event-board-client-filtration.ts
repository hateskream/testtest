import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue';

import type {
	CalendarCategoryType,
	CalendarCountryIdsType,
	CalendarImpactType,
	IEventBoardResponse,
} from '../model/calendar';
import { filterEventBoard } from '../utils/client-filtration';
import { isFeatureEnabled } from '@/shared/lib';

interface IUseEventBoardClientFiltrationOptions {
	data: MaybeRefOrGetter<IEventBoardResponse | undefined>;
	categories: MaybeRefOrGetter<CalendarCategoryType[]>;
	countries: MaybeRefOrGetter<CalendarCountryIdsType[]>;
	impacts: MaybeRefOrGetter<CalendarImpactType[]>;
}

interface IUseEventBoardClientFiltrationReturn {
	filteredData: ComputedRef<IEventBoardResponse | undefined>;
}

const isClientFiltration = isFeatureEnabled('CALENDAR_CLIENT_FILTRATION');

export function useEventBoardClientFiltration(
	options: IUseEventBoardClientFiltrationOptions,
): IUseEventBoardClientFiltrationReturn {
	const filteredData = computed(() => {
		const data = toValue(options.data);

		if (!data || !isClientFiltration) {
			return data;
		}

		return filterEventBoard(data, {
			categories: toValue(options.categories),
			countries: toValue(options.countries),
			impacts: toValue(options.impacts),
		});
	});

	return { filteredData };
}
