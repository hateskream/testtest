import { Tension, type ITensionTextData } from '../model';

export function useMapTension() {
	function mapTension(tension: number): ITensionTextData {
		if (tension <= Tension.extremeFear.max) {
			return {
				colors: {
					text: '#FF5C5C',
					chart: '#FF5C5C',
				},
				text: {
					main: 'Extreme Fear',
					sub: 'Oversold, Panic',
				},
			};
		}

		if (tension <= Tension.fear.max) {
			return {
				colors: {
					text: '#FF9151',
					chart: '#FF9151',
				},
				text: {
					main: 'Fear',
					sub: 'Caution, Uncertainty',
				},
			};
		}

		if (tension <= Tension.neutral.max) {
			return {
				colors: {
					text: '#FFF',
					chart: '#FFF',
				},
				text: {
					main: 'Neutral',
					sub: 'Balance',
				},
			};
		}

		if (tension <= Tension.greed.max) {
			return {
				colors: {
					text: '#92FFDB',
					chart: '#92FFDB',
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
