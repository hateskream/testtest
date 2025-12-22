import { z } from 'zod';

import { TimeZoneUTC } from './timezone';

export interface IState {
	timezone: TimeZoneUTC;
}

export const stateSchema = z.object({
	timezone: z.nativeEnum(TimeZoneUTC),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		timezone: TimeZoneUTC.UTC0,
	};
}
