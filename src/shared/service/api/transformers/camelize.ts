import { snakeToCamel, type SnakeToCamelCase } from '@/shared/lib';

export type Camelized<T> =
	T extends readonly (infer U)[]
		? Camelized<U>[]
		: T extends object
			? {
				[K in keyof T as SnakeToCamelCase<K & string>]: Camelized<T[K]>;
			}
			: T;

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return Object.prototype.toString.call(value) === '[object Object]';
}

export function camelize<T>(input: T): Camelized<T> {
	if (Array.isArray(input)) {
		return input.map(camelize) as Camelized<T>;
	}

	if (isPlainObject(input)) {
		return Object.fromEntries(
			Object.entries(input).map(([key, value]) => [
				snakeToCamel(key),
				camelize(value),
			]),
		) as Camelized<T>;
	}

	return input as Camelized<T>;
}

