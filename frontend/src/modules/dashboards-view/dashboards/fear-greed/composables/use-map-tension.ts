import type { ITensionTextData } from '../model';

export function useMapTension() {
	function mapTension(tension: number): ITensionTextData {
		if (tension <= 19) {
			return {
				colors: {
					text: '#FF5C5C',
					chart: '#F85961',
				},
				text: {
					main: 'Extreme Fear',
					sub: 'Oversold, Panic',
				},
			};
		}

		if (tension <= 39) {
			return {
				colors: {
					text: '#FFAF6A',
					chart: '#FFAF6A',
				},
				text: {
					main: 'Fear',
					sub: 'Caution, Uncertainty',
				},
			};
		}

		if (tension <= 59) {
			return {
				colors: {
					text: '#FFF',
					chart: '#DCDCDF',
				},
				text: {
					main: 'Neutral',
					sub: 'Balance',
				},
			};
		}

		if (tension <= 79) {
			return {
				colors: {
					text: '#B2F2D3',
					chart: '#B2F2D3',
				},
				text: {
					main: 'Greed',
					sub: 'Confidence, Optimism',
				},
			};
		}

		return {
			colors: {
				text: '#98FB0E',
				chart: '#98FB0E',
			},
			text: {
				main: 'Extreme Greed',
				sub: 'Overbought, High risk',
			},
		};
	}

	return { mapTension };
}
