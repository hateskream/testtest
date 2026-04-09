import { z } from 'zod';

import { TimezoneUtc, TimezoneUtcSchema, type TimezoneUtcType } from '@/modules/charts/common/model';
import type { WidgetState } from '@/modules/dashboard-group';

export interface IState extends WidgetState {
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
