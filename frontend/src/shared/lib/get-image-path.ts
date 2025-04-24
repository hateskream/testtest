export const ImageTypePath = {
	Stock: 'stock',
	Currency: 'currency',
} as const;

export type ImageTypePath = (typeof ImageTypePath)[keyof typeof ImageTypePath];

export const getImagePath = (name: string, type: ImageTypePath): string => {
	const normalizeName = name.replace(/[^A-Za-z]/g, '').toUpperCase();

	return new URL(`../../assets/images/${type}/${normalizeName}.png`, import.meta.url).href;
};
