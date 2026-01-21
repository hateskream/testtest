export interface IKeyIndicator {
	status: 'positive' | 'negative';
	label: string;
}

export interface IKeyIndicatorResponse {
	indicators: IKeyIndicator[];
}

export interface IKeyIndicatorRequest {
	ticker_id: string;
}
