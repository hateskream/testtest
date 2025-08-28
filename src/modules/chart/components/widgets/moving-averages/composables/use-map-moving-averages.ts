import { MovingAveragesSignal, type IMovingAveragesTextData } from '../models/moving-averages';

export function useMapMovingAverages() {
	function mapSignal(signal: number): IMovingAveragesTextData {
		if (signal <= MovingAveragesSignal.strongSell.max) {
			return {
				colors: {
					text: '#FF4444',
					chart: '#FF4444',
				},
				text: {
					main: 'Strong Sell',
					sub: 'Strong bearish signal',
				},
			};
		}

		if (signal <= MovingAveragesSignal.sell.max) {
			return {
				colors: {
					text: '#FF7744',
					chart: '#FF7744',
				},
				text: {
					main: 'Sell',
					sub: 'Bearish signal',
				},
			};
		}

		if (signal <= MovingAveragesSignal.neutral.max) {
			return {
				colors: {
					text: '#888888',
					chart: '#888888',
				},
				text: {
					main: 'Neutral',
					sub: 'No clear signal',
				},
			};
		}

		if (signal <= MovingAveragesSignal.buy.max) {
			return {
				colors: {
					text: '#44AA44',
					chart: '#44AA44',
				},
				text: {
					main: 'Buy',
					sub: 'Bullish signal',
				},
			};
		}

		return {
			colors: {
				text: '#00CC00',
				chart: '#00CC00',
			},
			text: {
				main: 'Strong Buy',
				sub: 'Strong bullish signal',
			},
		};
	}

	return { mapSignal };
}
