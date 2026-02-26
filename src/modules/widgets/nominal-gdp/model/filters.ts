import { NominalGdpDateRangePreset } from './nominal-gdp';
import { getDateRangePresetTitle } from '@/modules/lightweight-charts/model';

export const rangeFilters = Object.values(NominalGdpDateRangePreset).map(d => {
	return {
		label: getDateRangePresetTitle(d),
		value: d,
	};
});
