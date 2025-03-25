export const getCurrencyImage = (currencyName: string): string => {
	const normalizedName = currencyName.toLowerCase().replace(/\s+/g, '');
	return `@/assets/currency/${normalizedName}.png`;
};
