import { z } from 'zod';

import { CpiRange, CpiValueType } from './cpi';

export interface IState {
	valueType: CpiValueType;
	range: CpiRange;
}

export const stateSchema = z.object({
	valueType: z.nativeEnum(CpiValueType),
	range: z.nativeEnum(CpiRange),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		valueType: CpiValueType.Points,
		range: CpiRange.Year,
	};
}
