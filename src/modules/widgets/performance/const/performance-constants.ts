export const PERFORMANCE_COLORS = {
	POSITIVE: '#04EDA0',
	NEGATIVE: '#FC4A6B',
} as const;

export const PERFORMANCE_FILTER_TYPES = [
	{ name: 'Stock', value: 'stock' },
	{ name: 'Industry', value: 'industry' },
	{ name: 'Sector', value: 'sector' },
] as const;

export const PERFORMANCE_TIME_RANGES = [
	{ name: 'Today', value: 'today' },
	{ name: 'Yesterday', value: 'yesterday' },
	{ name: 'A week ago', value: 'week' },
] as const;

export const PERFORMANCE_DISPLAY_MODES = [
	{ name: 'Bar', value: 'bar' },
	{ name: 'List', value: 'list' },
] as const;

export const INITIAL_PERFORMANCE_SETTINGS = {
	displayMode: 'bar' as const,
	compactMode: false,
	filter: {
		type: 'industry' as const,
		timeRange: 'today' as const,
	},
};
