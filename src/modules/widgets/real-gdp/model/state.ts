import { z } from 'zod';

import { RealGdpRange } from './real-gdp';

export interface IState {
	range: RealGdpRange;
}

export const stateSchema = z.object({
	range: z.nativeEnum(RealGdpRange),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		range: RealGdpRange.TenYears,
	};
}
