const CURRENT_YEAR = new Date().getFullYear();

export function getDefaultYears(): number[] {
	return [CURRENT_YEAR - 1, CURRENT_YEAR];
}

export function getDefaultCurrency(): string {
	return 'usd';
}
