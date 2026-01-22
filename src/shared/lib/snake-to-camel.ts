export function snakeToCamel(str: string) {
	return str.replace(/_([a-z\d])/g, (_, c) => c.toUpperCase());
}
