import { ATR as ATRSignal } from 'trading-signals';

import { Indicator, type IndicatorConfig, type IndicatorPoint } from '../../base';
import type { Candle } from '../../candle.ts';

export interface IAtrConfig extends IndicatorConfig {
	interval: number;
}

export class AtrIndicator extends Indicator<IAtrConfig> {
	private atr: ATRSignal;

	constructor(config: IAtrConfig) {
		super(config);

		this.atr = new ATRSignal(this.config.interval);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const value = this.atr.add({
				high: candle.high,
				low: candle.low,
				close: candle.close,
			});

			if (value !== null) {
				this.values.push({
					time: candle.time,
					value,
				});
			}
		}
	}

	public update(candle: Candle): IndicatorPoint | null {
		const lastCandle = this.candles[this.candles.length - 1];

		if (lastCandle && lastCandle.time === candle.time) {
			this.candles[this.candles.length - 1] = { ...candle };
			this.calculate(this.candles);
			return this.getLastPoint();
		}

		this.candles.push({ ...candle });

		const value = this.atr.update(
			{
				high: candle.high,
				low: candle.low,
				close: candle.close,
			},
			true,
		);

		if (value === null) {
			return null;
		}

		const point = {
			time: candle.time,
			value,
		};

		this.values.push(point);

		return point;
	}

	public reset(): void {
		this.values = [];
		this.atr = new ATRSignal(this.config.interval);
	}
}

export function createAtr(config: IAtrConfig = { interval: 14 }) {
	return new AtrIndicator(config);
}
