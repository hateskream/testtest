export type RGBA = {
	r: number;
	g: number;
	b: number;
	a: number;
};

export function hexToRgba(hex: string, alpha = 1): RGBA {
	const cleanHex = hex.replace('#', '');

	const r = parseInt(cleanHex.slice(0, 2), 16);
	const g = parseInt(cleanHex.slice(2, 4), 16);
	const b = parseInt(cleanHex.slice(4, 6), 16);
	const a = cleanHex.length === 8 ? parseInt(cleanHex.slice(6, 8), 16) / 255 : alpha;

	return { r, g, b, a };
}
