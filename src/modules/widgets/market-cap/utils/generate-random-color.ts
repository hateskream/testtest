type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';

export function randomColor(format: ColorFormat = 'hex', alpha?: number): string {
	const randInt = (min: number, max: number) => {
		const range = max - min + 1;
		if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
			const buf = new Uint32Array(1);
			crypto.getRandomValues(buf);
			return min + (buf[0] % range);
		}
		return min + Math.floor(Math.random() * range);
	};

	const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

	const r = randInt(0, 255);
	const g = randInt(0, 255);
	const b = randInt(0, 255);
	const a = alpha !== undefined ? clamp01(alpha) : +(randInt(0, 100) / 100).toFixed(2);

	if (format === 'hex') {
		const toHex = (n: number) => n.toString(16).padStart(2, '0');
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}

	if (format === 'rgb') {
		return `rgb(${r}, ${g}, ${b})`;
	}
	if (format === 'rgba') {
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}

	const h = randInt(0, 360);
	const s = randInt(40, 100);
	const l = randInt(30, 70);

	if (format === 'hsl') {
		return `hsl(${h}deg ${s}% ${l}%)`;
	}
	return `hsla(${h}deg ${s}% ${l}% / ${a})`; // 'hsla'
}
