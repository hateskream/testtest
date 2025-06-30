import { TrendType, TrendCssClass } from './cell-types';

// Trend to CSS class mapping
export const TREND_TO_CLASS: Record<TrendType, TrendCssClass> = {
	[TrendType.UP]: TrendCssClass.POSITIVE,
	[TrendType.DOWN]: TrendCssClass.NEGATIVE,
	[TrendType.NEUTRAL]: TrendCssClass.NEUTRAL,
};

// Helper function to get trend class
export const getTrendClass = (trend?: string): TrendCssClass => {
	if (!trend) {
		return TrendCssClass.NEUTRAL;
	}
	return TREND_TO_CLASS[trend as TrendType] || TrendCssClass.NEUTRAL;
};

// Helper function to get trend class for numbers
export const getNumberTrendClass = (value?: string, trend?: string): TrendCssClass => {
	if (trend) {
		return getTrendClass(trend);
	}

	// Fallback to numeric comparison if no trend provided
	if (!value) {
		return TrendCssClass.NEUTRAL;
	}

	const numValue = parseFloat(value);
	if (numValue > 0) {
		return TrendCssClass.POSITIVE;
	}
	if (numValue < 0) {
		return TrendCssClass.NEGATIVE;
	}
	return TrendCssClass.NEUTRAL;
};

// Helper function to get trend class for percentages
export const getPercentTrendClass = (value?: string, trend?: string): TrendCssClass => {
	if (trend) {
		return getTrendClass(trend);
	}

	// Fallback to numeric comparison if no trend provided
	if (!value) {
		return TrendCssClass.NEUTRAL;
	}

	const numValue = parseFloat(value);
	if (numValue === 0) {
		return TrendCssClass.NEUTRAL;
	}
	if (numValue > 0) {
		return TrendCssClass.POSITIVE;
	}
	if (numValue < 0) {
		return TrendCssClass.NEGATIVE;
	}
	return TrendCssClass.NEUTRAL;
};
