import { cacheStringFunction } from './cache-string-function';

const CAMELIZE_EXPRESSION = /_([a-z\d])/g;

export const snakeToCamel = cacheStringFunction((str: string): string => {
	return str.replace(CAMELIZE_EXPRESSION, (_, c) => (c ? c.toUpperCase() : ''));
});
