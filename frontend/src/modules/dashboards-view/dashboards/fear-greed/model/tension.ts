export interface ITension {
	tension: number;

	history?: {
		[x in 'yesterday' | 'lastWeek' | 'lastMonth']: number;
	};
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
