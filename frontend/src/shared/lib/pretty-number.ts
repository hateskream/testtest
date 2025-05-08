import Decimal from 'decimal.js';

export function prettyNumberWithKey(val: string): {
	value: string;
	suffix: string;
} {
	const num = new Decimal(val);

	if (num.gte(1000)) {
		const suffixes = ['K', 'M', 'B', 'T'];
		const tier = num.log(10).div(3).toDecimalPlaces(0, 1);
		const suffix = suffixes[tier.toNumber() - 1];

		const scaledNum = num.dividedBy(new Decimal(10).pow(tier.mul(3)));
		return {
			value: scaledNum.toFixed(1),
			suffix,
		};
	}

	return {
		value: num.toString(),
		suffix: '',
	};
}
