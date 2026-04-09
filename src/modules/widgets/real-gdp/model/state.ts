import { z } from 'zod';

import type { WidgetState } from '@/modules/dashboard-group';
import { RealGdpDateRangePreset, RealGdpDateRangePresetSchema, type RealGdpDateRangePresetType } from './real-gdp';

export interface IState extends WidgetState {
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
