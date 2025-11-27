import { z } from 'zod';

import { CpiMetric, CpiRange } from './cpi';

export interface IState {
	metric: CpiMetric;
	range: CpiRange;
}

export const stateSchema = z.object({
	metric: z.nativeEnum(CpiMetric),
	range: z.nativeEnum(CpiRange),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		metric: CpiMetric.Points,
		range: CpiRange.Year,
	};
}
