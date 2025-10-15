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


export const Tension = {
	extremeFear: {
		min: 0,
		max: 24,
	},
	fear: {
		min: 25,
		max: 45,
	},
	neutral: {
		min: 46,
		max:54,
	},
	greed: {
		min: 55,
		max:75,
	},
	extremeGreed: {
		min: 76,
		max:100,
	},
};
