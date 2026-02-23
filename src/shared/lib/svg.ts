export type CreateAnnularSectorPathOptions = {
	cx: number;
	cy: number;

	/**
	 * Радиус внешней окружности (большой)
	 */
	R: number;

	/**
	 * Радиус внутренней окружности (малой)
	 */
	r: number;

	/**
	 * Радианы
	 */
	from: number;

	/**
	 * Радианы
	 */
	to: number;
};

export function createAnnularSectorPath(options: CreateAnnularSectorPathOptions) {
	const { cx, cy, r, R, to, from } = options;

	const fromCos = Math.cos(from);
	const fromSin = Math.sin(from);
	const toCos = Math.cos(to);
	const toSin = Math.sin(to);

	const x1 = cx + R * fromCos;
	const y1 = cy + R * fromSin;

	const x2 = cx + R * toCos;
	const y2 = cy + R * toSin;

	const x3 = cx + r * toCos;
	const y3 = cy + r * toSin;

	const x4 = cx + r * fromCos;
	const y4 = cy + r * fromSin;

	const delta = to - from;
	const largeArcFlag = Math.abs(delta) > Math.PI ? 1 : 0;

	return `M ${x1} ${y1}
    A ${R} ${R} 0 ${largeArcFlag} 1 ${x2} ${y2}
    L ${x3} ${y3}
    A ${r} ${r} 0 ${largeArcFlag} 0 ${x4} ${y4}
    Z`;
}


export type CreateCircularArcPathOptions = {
	cx: number;
	cy: number;
	r: number;

	/**
	 * Радианы
	 */
	from: number;

	/**
	 * Радианы
	 */
	to: number;
};

export function createCircularArcPath(options: CreateCircularArcPathOptions) {
	const { cx, cy, r, to, from } = options;

	const x1 = cx + r * Math.cos(from);
	const y1 = cy + r * Math.sin(from);

	const x2 = cx + r * Math.cos(to);
	const y2 = cy + r * Math.sin(to);

	return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
}
