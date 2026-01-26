import { z } from 'zod';

import { CalendarCategory, CalendarCountryIds, CalendarImpact } from './calendar';

export interface ICalendarStorage {
	selectedCountries: CalendarCountryIds[];
	selectedCategories: CalendarCategory[];
	selectedImpacts: CalendarImpact[];
}

export const calendarStorageSchema = z.object({
	selectedCountries: z.array(z.nativeEnum(CalendarCountryIds)),
	selectedCategories: z.array(z.nativeEnum(CalendarCategory)),
	selectedImpacts: z.array(z.nativeEnum(CalendarImpact)),
});

export type CalendarStorageSchemaType = z.infer<typeof calendarStorageSchema>;
