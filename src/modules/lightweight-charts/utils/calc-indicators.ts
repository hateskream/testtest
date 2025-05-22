import type { LineData } from 'lightweight-charts';
import { SMA } from 'technicalindicators';

export function calculateSMASeriesData(data: LineData[]) {
	const period = Math.min(data.length, 100);

	const vals = SMA.calculate({
		period,
		values: data.map(item => item.value),
	});

	return vals.map((item, index) => ({
		time: data[index].time,
		value: item,
	}));
}
