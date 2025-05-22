import type { LineData, Time } from 'lightweight-charts';

let randomFactor = 125 + Math.random() * 125;
const samplePoint = (i: number) =>
	i *
	(0.5 +
		Math.sin(i / 10) * 0.2 +
		Math.sin(i / 20) * 0.4 +
		Math.sin(i / randomFactor) * 0.8 +
		Math.sin(i / 500) * 0.5) +
	350;

export function generateLineData(numberOfPoints: number = 500): LineData[] {
	randomFactor = 25 + Math.random() * 25;
	const res = [];
	const date = new Date(Date.UTC(2005, 0, 1, 12, 0, 0, 0));
	for (let i = 0; i < numberOfPoints; ++i) {
		const time = (date.getTime() / 1000) as Time;
		const value = samplePoint(i);
		res.push({
			time,
			value,
		});

		date.setUTCDate(date.getUTCDate() + 1);
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


export function generateCandleDataFromLineData(data:LineData[]) {
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
