export const getCurrencyImage = (currencyName: string): string => {
	const normalizeName = currencyName.replace(/[^A-Za-z]/g, '').toUpperCase();

	return new URL(`../../assets/images/currency/${normalizeName}.png`, import.meta.url).href;
};
