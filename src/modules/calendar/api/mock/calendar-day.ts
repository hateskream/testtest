import type { IDailyCalendarInfoRequest, IDailyCalendarInfoResponse } from '../../models';
import { toUtcIsoDate } from '../../utils';

export function createMockApiDays(options: IDailyCalendarInfoRequest): IDailyCalendarInfoResponse[] {
	const from = new Date(options.from);
	const to = new Date(options.to);

	from.setHours(0, 0, 0, 0);
	to.setHours(0, 0, 0, 0);

	const out: IDailyCalendarInfoResponse[] = [];

	for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
		out.push({
			date: toUtcIsoDate(new Date(d)),
			metrics: {
				economic: Math.round(Math.random() * 100),
				earnings: Math.round(Math.random() * 100),
				dividends: Math.round(Math.random() * 1000),
			},
		});
	}

	return out;
}
