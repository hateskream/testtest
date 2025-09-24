import type { DateYYYYMMDD } from '@/modules/calendar';

export interface IDailyCalendarInfoRequest {
	from: DateYYYYMMDD;
	to: DateYYYYMMDD;
}

export interface IDailyCalendarInfoResponse {
	date: string;
	metrics: {
		economic: number;
		earnings: number;
		dividends: number;
	};
}
