import { z } from 'zod';

import type { WidgetState } from '@/modules/dashboard-group';
import {
	NominalGdpDateRangePreset,
	NominalGdpDateRangePresetSchema,
	type NominalGdpDateRangePresetType,
} from './nominal-gdp';

export interface IState extends WidgetState {
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
