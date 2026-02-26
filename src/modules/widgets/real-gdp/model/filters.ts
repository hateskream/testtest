import { RealGdpDateRangePreset, RealGdpValueType, type RealGdpValueTypeType } from './real-gdp';
import { getDateRangePresetTitle } from '@/modules/lightweight-charts/model';

export const rangeFilters = Object.values(RealGdpDateRangePreset).map(d => {
	return {
		label: getDateRangePresetTitle(d),
		value: d,
	};
});

export const valueTypeFilterValueToDisplay = {
	[RealGdpValueType.Points]: 'Points',
	[RealGdpValueType.ChangeDelta]: 'Change',
	[RealGdpValueType.ChangePercent]: 'Change, %',
} as const satisfies Record<RealGdpValueTypeType, string>;

export const valueTypeFilters = Object.values(RealGdpValueType)
	.map(value => ({ label: valueTypeFilterValueToDisplay[value], value }));

