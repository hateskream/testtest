import type {
	CalendarCategoryType,
	CalendarCountryIdsType,
	CalendarImpactType,
	ICalendarEvent,
	IEventBoardResponse,
} from '../model/calendar';

export interface IClientFiltrationOptions {
	categories?: CalendarCategoryType[];
	countries?: CalendarCountryIdsType[];
	impacts?: CalendarImpactType[];
}

function matchesFilter<T>(value: T, allowed: T[] | undefined): boolean {
	return !allowed || allowed.length === 0 || allowed.includes(value);
}

function filterEvent(event: ICalendarEvent, options: IClientFiltrationOptions): boolean {
	return matchesFilter(event.meta.category, options.categories)
		&& matchesFilter(event.meta.country, options.countries)
		&& matchesFilter(event.meta.impact, options.impacts);
}

export function filterEventBoard(
	response: IEventBoardResponse,
	options: IClientFiltrationOptions,
): IEventBoardResponse {
	const days = response.days
		.map(day => ({
			date: day.date,
			events: day.events.filter(event => filterEvent(event, options)),
		}))
		.filter(day => day.events.length > 0);

	return { days };
}
