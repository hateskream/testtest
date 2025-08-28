type NonUndefined<T extends object> = {
	[K in keyof T]-?: T[K];
};

export function removeUndefinedPropertiesFromObject<T extends object>(args: T): NonUndefined<T> {
	const temp = { ...JSON.parse(JSON.stringify(args)) };

	Object.keys(temp).forEach(key => {
		if (temp[key] === undefined || temp[key] === null) {
			delete temp[key];
		}
	});

	return temp;
}
