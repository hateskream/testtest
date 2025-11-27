import { z } from 'zod';

import { NominalGdpRange } from './nominal-gdp';

export interface IState {
	range: NominalGdpRange;
}

export const stateSchema = z.object({
	range: z.nativeEnum(NominalGdpRange),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		range: NominalGdpRange.TenYears,
	};
}
