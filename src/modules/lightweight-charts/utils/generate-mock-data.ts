/* oxlint-disable no-plusplus */
import type { LineData, Time } from 'lightweight-charts';

let randomFactor = 125 + Math.random() * 125;
export const samplePoint = (i: number) =>
	i *
	(1125 +
		Math.sin(i / 10) +
		Math.sin(i / 20) * 0.4 +
		Math.sin(i / randomFactor) +
		Math.sin(i / 500) * 0.5) +
	350;

export function generateLineData(numberOfPoints: number = 500, daySpace: number = 1): LineData[] {
	randomFactor = 125 + Math.random() * 125;
	const res = [];
	const date = new Date(Date.UTC(1998, 0, 0, 12, 0, 0, 0));
	for (let i = 0; i < numberOfPoints; ++i) {
		const time = (date.getTime() / 1000) as Time;
		const value = samplePoint(i);
		res.push({
			time,
			value,
		});

		date.setUTCDate(date.getUTCDate() + daySpace);
	}

	return res;
}


function randomNumber(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function randomBar(lastClose: number) {
	const open = +randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
	const close = +randomNumber(open * 0.95, open * 1.05).toFixed(2);
	const high = +randomNumber(
		Math.max(open, close),
		Math.max(open, close) * 1.1,
	).toFixed(2);
	const low = +randomNumber(
		Math.min(open, close) * 0.9,
		Math.min(open, close),
	).toFixed(2);
	return {
		open,
		high,
		low,
		close,
	};
}


export function generateCandleDataFromLineData(data: LineData[]) {
	let lastClose = data[0].value;
	return data.map(d => {
		const candle = randomBar(lastClose);
		lastClose = candle.close;
		return {
			time: d.time,
			low: candle.low,
			high: candle.high,
			open: candle.open,
			close: candle.close,
		};
	});
}


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

export const generateRandomNum = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export function generateRandomNumbers(count: number, min: number = -100, max: number = 100) {
	return Array.from({ length: count }, () => generateRandomNum(min, max));
}
