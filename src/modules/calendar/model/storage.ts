import { z } from 'zod';

import {
	CalendarCategory,
	type CalendarCategoryType,
	CalendarCountryIds,
	type CalendarCountryIdsType,
	CalendarImpact,
	type CalendarImpactType,
} from './calendar';

export interface ICalendarStorage {
	selectedCountries: CalendarCountryIdsType[];
	selectedCategories: CalendarCategoryType[];
	selectedImpacts: CalendarImpactType[];
}

export const calendarStorageSchema = z.object({
	selectedCountries: z.array(z.nativeEnum(CalendarCountryIds)),
	selectedCategories: z.array(z.nativeEnum(CalendarCategory)),
	selectedImpacts: z.array(z.nativeEnum(CalendarImpact)),
});

export type CalendarStorageSchemaType = z.infer<typeof calendarStorageSchema>;
