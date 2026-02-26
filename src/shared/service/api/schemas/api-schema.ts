import { z } from 'zod';

import { camelize } from '../transformers';

export function apiSchema<T>(
	schema: z.ZodType<T>,
): z.ZodType<T, z.ZodTypeDef, unknown> {
	return z.preprocess((input) => camelize(input), schema);
}

