/**
 * @param color hex or rgb format
 * @param alpha from 0 to 1
 */
export function colorToRgba(color: string, alpha: number = 1): string {
	const value = color.trim();

	if (value.startsWith('#')) {
		let hex = value.slice(1);

		if (hex.length === 3) {
			hex = hex.split('').map(ch => ch + ch).join('');
		}

		if (hex.length === 6) {
			hex += 'ff';
		}

		const [r, g, b, a] = [
			parseInt(hex.slice(0, 2), 16),
			parseInt(hex.slice(2, 4), 16),
			parseInt(hex.slice(4, 6), 16),
			parseInt(hex.slice(6, 8), 16) / 255,
		];

		return `rgba(${r}, ${g}, ${b}, ${alpha ?? a})`;
	}

	if (color.startsWith('rgb')) {
		const parts = color.match(/[\d.]+/g);
		if (!parts) {
			return 'rgba(0,0,0,1)';
		}

		const [r, g, b, a = 1] = parts.map(Number);

		return `rgba(${r}, ${g}, ${b}, ${alpha ?? a})`;
	}

	return 'rgba(0,0,0,1)';
}
