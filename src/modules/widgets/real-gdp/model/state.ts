import { z } from 'zod';

import { RealGdpDateRangePreset, RealGdpDateRangePresetSchema, type RealGdpDateRangePresetType } from './real-gdp';

export interface IState {
	range: RealGdpDateRangePresetType;
}

export const stateSchema = z.object({
	range: RealGdpDateRangePresetSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		range: RealGdpDateRangePreset.TenYears,
	};
}
