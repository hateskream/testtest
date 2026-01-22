export interface IKeyIndicator {
	status: 'positive' | 'negative' | 'neutral';
	label: string;
}

export interface IKeyIndicatorResponse {
	indicators: IKeyIndicator[];
	summarized: string;
}

export interface IKeyIndicatorRequest {
	ticker_id: string;
}
