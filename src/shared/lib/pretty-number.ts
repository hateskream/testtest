import Decimal from 'decimal.js';

export interface IPrettyNumberPayload {
	value: string;
	suffix: string;
	row: string;
}

export function prettyNumberWithKey(val: string, precision: number = 1): IPrettyNumberPayload {
	const num = new Decimal(val);

	if (num.gte(1000)) {
		const suffixes = ['K', 'M', 'B', 'T'];
		const tier = num.log(10).div(3).toDecimalPlaces(0, 1);
		const suffix = suffixes[tier.toNumber() - 1];

		const scaledNum = num.dividedBy(new Decimal(10).pow(tier.mul(3))).toFixed(precision);

		return {
			value: scaledNum,
			row: `${scaledNum}${suffix}`,
			suffix,
		};
	}

	return {
		value: num.toString(),
		row: num.toString(),
		suffix: '',
	};
}
