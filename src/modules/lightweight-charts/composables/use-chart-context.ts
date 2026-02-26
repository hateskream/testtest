import { inject, type InjectionKey, provide } from 'vue';

import type { ICandle } from '@/modules/chart';

type CandleListener = (candle: ICandle) => void;
type CandleBulkListener = (candles: ICandle[]) => void;

export interface IChartContext {
	push: (candle: ICandle) => void;
	subscribe: (listener: CandleListener) => () => void;
	unsubscribe: (listener: CandleListener) => void;
	subscribeBulk: (listener: CandleBulkListener) => () => void;
	unsubscribeBulk: (listener: CandleBulkListener) => void;
	init: (candles: ICandle[]) => void;
	getAll: () => ICandle[];
}

const injectionKey: InjectionKey<IChartContext> = Symbol('chartContext');

export function createChartContext() {
	let candles: ICandle[] = [];
	let listeners: CandleListener[] = [];
	let bulkListeners: CandleBulkListener[] = [];

	function init(initialCandles: ICandle[]) {
		candles = [...initialCandles];

		bulkListeners.forEach(listener => listener(candles));
	}

	function push(candle: ICandle) {
		const last = candles[candles.length - 1];

		if (last && last.time === candle.time) {
			candles[candles.length - 1] = candle;
		} else {
			candles.push(candle);
		}

		listeners.forEach(listener => listener(candle));
	}

	function subscribe(listener: CandleListener) {
		listeners.push(listener);
		return () => unsubscribe(listener);
	}

	function unsubscribe(listener: CandleListener) {
		listeners = listeners.filter(ls => ls !== listener);
	}

	function subscribeBulk(listener: CandleBulkListener) {
		bulkListeners.push(listener);

		return () => unsubscribeBulk(listener);
	}

	function unsubscribeBulk(listener: CandleBulkListener) {
		bulkListeners = bulkListeners.filter(ls => ls !== listener);
	}

	function getAll() {
		return candles;
	}

	const context = {
		init,
		push,
		subscribe,
		unsubscribe,
		subscribeBulk,
		unsubscribeBulk,
		getAll,
	};

	provide(injectionKey, context);

	return context;
}

export function useChartContext() {
	const context = inject(injectionKey);

	if (!context)	{
		throw new Error('createChartContext must be defined');
	}

	return context;
}
