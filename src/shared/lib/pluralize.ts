export function pluralize(count: number, single: string, plural?: string): string {
	if (count === 1) {
		return single;
	}

	if (plural) {
		return plural;
	}

	// consonant + y → ies (city → cities)
	if (/[bcdfghjklmnpqrstvwxyz]y$/i.test(single)) {
		return single.replace(/y$/i, 'ies');
	}

	// s, sh, ch, x, z → es
	if (/(s|sh|ch|x|z)$/i.test(single)) {
		return `${single}es`;
	}

	return `${single}s`;
}

export function pluralizeTemplate(count: number, single: string, plural?: string): string {
	const pluralized = pluralize(count, single, plural);
	return pluralized.replace('%d', count.toString());
}
