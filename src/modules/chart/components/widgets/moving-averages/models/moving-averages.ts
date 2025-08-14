export interface IMovingAveragesSignal {
	signal: number; // 0-100
	summary: 'Strong Sell' | 'Sell' | 'Neutral' | 'Buy' | 'Strong Buy';
}

export interface IMovingAveragesTextData {
	colors: {
		text: string;
		chart: string;
	};
	text: {
		main: string;
		sub: string;
	};
}

export interface IMovingAveragesSize {
	w: number;
	h: number;
}

export interface IMovingAveragesSettings {
	isShowChart: boolean;
	isShowName: boolean;
	isShowDescription: boolean;
}

export const MovingAveragesSignal = {
	strongSell: {
		min: 0,
		max: 20,
	},
	sell: {
		min: 21,
		max: 40,
	},
	neutral: {
		min: 41,
		max: 60,
	},
	buy: {
		min: 61,
		max: 80,
	},
	strongBuy: {
		min: 81,
		max: 100,
	},
};

const DEFAULT_VIEW_STATE: IMovingAveragesSettings = {
	isShowChart: true,
	isShowName: true,
	isShowDescription: true,
};

export function getDefaultMovingAveragesViewState(): IMovingAveragesSettings {
	return { ...DEFAULT_VIEW_STATE };
}
