import { klona } from 'klona';

export function clone<T>(value: T): T {
	return klona(value);
}
