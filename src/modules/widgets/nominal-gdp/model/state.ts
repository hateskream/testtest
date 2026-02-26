import { z } from 'zod';

import {
	NominalGdpDateRangePreset,
	NominalGdpDateRangePresetSchema,
	type NominalGdpDateRangePresetType,
} from './nominal-gdp';

export interface IState {
	range: NominalGdpDateRangePresetType;
}

export const stateSchema = z.object({
	range: NominalGdpDateRangePresetSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		range: NominalGdpDateRangePreset.TenYears,
	};
}
