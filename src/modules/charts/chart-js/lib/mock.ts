import { randomInt } from '@/shared/lib';

export function generateQuartalLabels(countYears: number) {
	const quartals: string[] = [];
	let year = new Date().getFullYear();

	for (let i = 0; i < countYears; i += 1) {
		quartals.unshift(
			`Q1 ${year}`,
			`Q2 ${year}`,
			`Q3 ${year}`,
			`Q4 ${year}`,
		);

		year -= 1;
	}

	return quartals;
}

export function generateRandomNumbers(count: number, min: number = -100, max: number = 100) {
	return Array.from({ length: count }, () => randomInt(min, max));
}
