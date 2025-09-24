export interface IDailyCalendarInfoResponse {
	date: string;
	metrics: {
		economic: number;
		earnings: number;
		dividends: number;
	};
}
