export interface IPerformanceItem {
	id: string;
	name: string;
	change: number; // Percentage change
	type: 'industry' | 'sector';
}

export interface IPerformanceFilter {
	type: 'industry' | 'sector';
	timeRange: 'today' | 'yesterday' | 'week' | 'custom';
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
	type?: 'industry' | 'sector';
	timeRange?: 'today' | 'yesterday' | 'week' | 'custom';
}
