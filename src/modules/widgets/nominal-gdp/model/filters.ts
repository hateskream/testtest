import { NominalGdpDateRangePreset } from './nominal-gdp';
import { getDateRangePresetTitle } from '@/modules/charts/common/model';

export const rangeFilters = Object.values(NominalGdpDateRangePreset).map(d => {
	return {
		label: getDateRangePresetTitle(d),
		value: d,
	};
});
