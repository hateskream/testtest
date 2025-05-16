export interface ITension {
	tension: number;

	history?: {
		displayName: string;
		name: 'yesterday' | 'lastWeek' | 'lastMonth';
		value: number;
	}[];
}

export interface ITensionTextData {
	colors: {
		text: string;
		chart: string;
	};
	text: {
		main: string;
		sub: string;
	};
}
