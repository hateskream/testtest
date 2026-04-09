import type { WidgetState } from '@/modules/dashboard-group';
import {
	CalendarCategory,
	type CalendarCategoryType,
	CalendarCountryIds,
	type CalendarCountryIdsType,
	CalendarImpact,
	type CalendarImpactType,
} from './calendar';

export interface IState extends WidgetState {
	selectedCountries?: CalendarCountryIdsType[];
	selectedCategories?: CalendarCategoryType[];
	selectedImpacts?: CalendarImpactType[];
}

export function getDefaultsState(): IState {
	return {
		selectedCountries: Object.values(CalendarCountryIds),
		selectedCategories: Object.values(CalendarCategory),
		selectedImpacts: Object.values(CalendarImpact),
	};
}
