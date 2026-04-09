import { z } from 'zod';

import type { WidgetState } from '@/modules/dashboard-group';
import {
	CpiDateRangePreset,
	CpiDateRangePresetSchema,
	type CpiDateRangePresetType,
	CpiValueType,
	CpiValueTypeSchema,
	type CpiValueTypeType,
} from './cpi';

export interface IState extends WidgetState {
	valueType: CpiValueTypeType;
	range: CpiDateRangePresetType;
}

export const stateSchema = z.object({
	valueType: CpiValueTypeSchema,
	range: CpiDateRangePresetSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		valueType: CpiValueType.Points,
		range: CpiDateRangePreset.Year,
	};
}
