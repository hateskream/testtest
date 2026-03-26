const FORECAST_POSITIVE_COLOR = '#04EDA0';
const FORECAST_NEGATIVE_COLOR = '#FC4A6B';

const FORECAST_LABEL_POSITIVE_COLORS = { label: '#162D27', text: '#04EDA0' } as const;
const FORECAST_LABEL_NEGATIVE_COLORS = { label: '#281117', text: '#FC1D4D' } as const;

const TRIANGLE_POSITIVE_COLOR = '#04EDA0';
const TRIANGLE_NEGATIVE_COLOR = '#FC4A6B';

export function getForecastColor(forecast: number, current: number) {
	return forecast >= current ? FORECAST_POSITIVE_COLOR : FORECAST_NEGATIVE_COLOR;
}

export function getForecastLabelColors(forecast: number, current: number) {
	return forecast >= current ? FORECAST_LABEL_POSITIVE_COLORS : FORECAST_LABEL_NEGATIVE_COLORS;
}

export function getTriangleColor(forecast: number, current: number) {
	return forecast >= current ? TRIANGLE_POSITIVE_COLOR : TRIANGLE_NEGATIVE_COLOR;
}

