import { z } from 'zod';

import { TimezoneUtc, TimezoneUtcSchema, type TimezoneUtcType } from '@/modules/lightweight-charts/model';

export interface IState {
	timezone: TimezoneUtcType;
}

export const stateSchema = z.object({
	timezone: TimezoneUtcSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		timezone: TimezoneUtc.UTC0,
	};
}
