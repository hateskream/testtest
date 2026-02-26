import {
	type ComponentInstance,
	type MaybeRefOrGetter,
	nextTick,
	onBeforeUnmount,
	onMounted,
	type TemplateRef,
	toValue,
	watch,
} from 'vue';

import {
	createIndicator,
	getIndicatorSeriesConfig,
	type IndicatorType,
	mapIndicatorToBaselineSeries,
} from '@/modules/indicator';
import { useChartContext } from './use-chart-context.ts';

import ChartComponent from '../ui/chart-component.vue';

export function useChartContextIndicators(
	chart: TemplateRef<ComponentInstance<typeof ChartComponent>>,
	indicators: MaybeRefOrGetter<IndicatorType[]>,
) {
	const context = useChartContext();

	const currentIndicators = {} as Record<IndicatorType, () => void>;

	function addIndicator(indicator: IndicatorType) {
		const current = currentIndicators[indicator];
		if (current) {
			return current;
		}

		const value = registerIndicator(indicator);
		if (value) {
			currentIndicators[indicator] = value;
			return value;
		}

		return null;
	}

	function registerIndicator(indicator: IndicatorType) {
		if (!context) {
			return;
		}

		const chartValue = toValue(chart);
		if (!chartValue) {
			return;
		}

		const indicatorInstance = createIndicator(indicator);
		indicatorInstance.calculate(context.getAll());

		const config = getIndicatorSeriesConfig(indicator);
		const series = chartValue.addSeries(
			config.definition,
			config.options,
			config.paneIndex,
			config.isPrice ?? true,
		);
		if (series) {
			const data = mapIndicatorToBaselineSeries(indicatorInstance.getResult());
			series.setData(data);
		}

		const cleanupBulk = context.subscribeBulk((candles) => {
			indicatorInstance.calculate(candles);
		});

		const cleanup = context.subscribe((candle) => {
			indicatorInstance.update(candle);
		});

		return () => {
			cleanup();
			cleanupBulk();

			if (chartValue && series) {
				chartValue.removeSeries(series);
			}
		};
	}

	function deleteIndicator(indicator: IndicatorType) {
		const unsubscriber = currentIndicators[indicator];
		if (unsubscriber) {
			unsubscriber();
			delete currentIndicators[indicator];
		}
	}

	function updateIndicators(newIndicators: IndicatorType[], oldIndicators: IndicatorType[]) {
		const deletedIndicators = oldIndicators.filter(indicator => !newIndicators.includes(indicator));
		const addedIndicators = newIndicators.filter(indicator => !oldIndicators.includes(indicator));

		for (const indicator of deletedIndicators) {
			deleteIndicator(indicator);
		}

		for (const indicator of addedIndicators) {
			addIndicator(indicator);
		}
	}

	watch(() => toValue(indicators), (newIndicators, oldIndicators) => {
		updateIndicators(newIndicators, oldIndicators ?? []);
	}, { deep: true });

	onMounted(() => {
		void nextTick(() => {
			const indicatorsValue = toValue(indicators);
			if (indicatorsValue.length) {
				updateIndicators(indicatorsValue, []);
			}
		});
	});

	onBeforeUnmount(() => {
		Object.keys(currentIndicators).forEach(key => {
			deleteIndicator(key as IndicatorType);
		});
	});
}
