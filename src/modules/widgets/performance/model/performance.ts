export interface IPerformanceItem {
	id: string;
	name: string;
	change: number; // Percentage change
	type: 'stock' | 'industry' | 'sector';
}

export interface IPerformanceFilter {
	type: 'stock' | 'industry' | 'sector';
	timeRange: 'today' | 'yesterday' | 'week';
}

export interface IPerformanceSettings {
	displayMode: 'bar' | 'list';
	compactMode: boolean;
	filter: IPerformanceFilter;
}

export interface IPerformanceResponse {
	data: IPerformanceItem[];
}

export interface IGetPerformanceRequest {
	type?: 'stock' | 'industry' | 'sector';
	timeRange?: 'today' | 'yesterday' | 'week';
}
