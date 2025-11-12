export interface IFirstWithCountOptions {
	default?: string;
	separator?: string;
	prefix?: string;
}

export interface IFirstWithCountResult<T> {
	first: T | null;
	rest: T[];
	restCount: number;
	empty: boolean;
	toString: () => string;
	toObject: () => {
		first: T | null;
		rest: T[];
		restCount: number;
		empty: boolean;
	};
}

export function formatWithCount<T>(
	list: T[] | Set<T>,
	options?: string | IFirstWithCountOptions,
): IFirstWithCountResult<T> {
	const opts: IFirstWithCountOptions =
		typeof options === 'string'
			? { default: options }
			: options ?? {};

	const arr = Array.isArray(list) ? list : Array.from(list);
	const empty = arr.length === 0;

	const first = empty ? null : arr[0];
	const rest = empty ? [] : arr.slice(1);
	const restCount = rest.length;

	const toString = () => {
		if (empty) {
			return opts.default ?? '';
		}

		if (restCount <= 0) {
			return String(first);
		}

		const sep = opts.separator ?? ' ';
		const prefix = opts.prefix ?? '+';

		return `${first}${sep}${prefix}${restCount}`;
	};

	const toObject = () => ({
		first,
		rest,
		restCount,
		empty,
	});

	return {
		first,
		rest,
		restCount,
		empty,
		toString,
		toObject,
	};
}
