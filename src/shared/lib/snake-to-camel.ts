export type SnakeToCamelCase<S extends string> =
	S extends `${infer Head}_${infer Tail}`
		? `${Head}${Capitalize<SnakeToCamelCase<Tail>>}`
		: S;

const CAMELIZE_EXPRESSION = /_([a-z\d])/g;

export function snakeToCamel<T extends string>(str: T): SnakeToCamelCase<T> {
	return str.replace(CAMELIZE_EXPRESSION, (_, c) => c ? c.toUpperCase() : '') as SnakeToCamelCase<T>;
}
