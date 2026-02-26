import { CpiDateRangePreset, CpiValueType, type CpiValueTypeType } from './cpi';
import { getDateRangePresetTitle } from '@/modules/lightweight-charts/model';

export const rangeFilters = Object.values(CpiDateRangePreset)
	.map(option => ({ label: getDateRangePresetTitle(option), value: option }));


export const valueTypeFilterValueToDisplay = {
	[CpiValueType.Points]: 'Points',
	[CpiValueType.ChangeDelta]: 'Change',
	[CpiValueType.ChangePercent]: 'Change, %',
} as const satisfies Record<CpiValueTypeType, string>;

export const valueTypeFilters = Object.values(CpiValueType)
	.map(value => ({ label: valueTypeFilterValueToDisplay[value], value }));

