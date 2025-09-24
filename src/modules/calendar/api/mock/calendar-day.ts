import type { IDailyCalendarInfoResponse } from '../../models';
import { toUtcIsoDate } from '../../utils';

export function createMockApiDays(past = 21, future = 42): IDailyCalendarInfoResponse[] {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const out: IDailyCalendarInfoResponse[] = [];
	for (let offset = -past; offset <= future; offset += 1) {
		const d = new Date(today);
		d.setDate(today.getDate() + offset);

		out.push({
			date: toUtcIsoDate(d),
			metrics: {
				economic: Math.round(Math.random() * 100),
				earnings: Math.round(Math.random() * 100),
				dividends: Math.round(Math.random() * 1000),
			},
		});
	}

	return out;
}
