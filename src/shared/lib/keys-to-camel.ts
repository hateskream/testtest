import { snakeToCamel } from './snake-to-camel';

type SnakeToCamel<S extends string> =
	S extends `${infer T}_${infer U}` ? `${T}${Capitalize<SnakeToCamel<U>>}` : S;

type KeysToCamel<T> = T extends (infer U)[]
	? KeysToCamel<U>[]
	: T extends object
		? { [K in keyof T as SnakeToCamel<string & K>]: KeysToCamel<T[K]> }
		: T;

export function keysToCamel<T>(obj: T): KeysToCamel<T> {
	if (Array.isArray(obj)) {
		return obj.map(keysToCamel) as KeysToCamel<T>;
	}

	if (obj !== null && typeof obj === 'object') {
		return Object.fromEntries(
			Object.entries(obj).map(([k, v]) => [
				snakeToCamel(k),
				keysToCamel(v),
			]),
		) as KeysToCamel<T>;
	}

	return obj as KeysToCamel<T>;
}
