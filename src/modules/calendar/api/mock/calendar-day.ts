import type { IDailyCalendarInfo } from '../../types';

function toUtcIsoDate(d: Date): string {
	return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
		.toISOString()
		.split('T')[0];
}

export function createMockApiDays(past = 21, future = 42): IDailyCalendarInfo[] {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const out: IDailyCalendarInfo[] = [];
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
