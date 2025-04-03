export function isNumeric(str: string) {
	if (typeof str !== 'string') {
		return false;
	} // we only process strings!
	return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
}
