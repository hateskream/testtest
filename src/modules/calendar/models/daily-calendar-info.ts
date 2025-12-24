import type { DateYYYYMMDD } from '@/modules/calendar';

export interface IDailyCalendarInfoRequest {
	from: DateYYYYMMDD;
	to: DateYYYYMMDD;
}

export interface IDailyCalendarInfoResponse {
	date: string;
	metrics: {
		crypto_events: number;
		dividends: number;
		earnings: number;
		economic: number;
		ipo: number;
		news: number;
		splits: number;
	};
}
