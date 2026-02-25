import { WilliamsR } from 'trading-signals';

import {
	Indicator,
	type IndicatorConfig,
	type IndicatorPoint,
} from '../../base';
import type { Candle } from '../../candle.ts';

export interface IWillrConfig extends IndicatorConfig {
	interval: number;
}

export class WillrIndicator extends Indicator<IWillrConfig> {
	private willr: WilliamsR;

	constructor(config: IWillrConfig) {
		super(config);

		this.willr = new WilliamsR(this.config.interval);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const value = this.willr.add({
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

		const value = this.willr.update(
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
		this.willr = new WilliamsR(this.config.interval);
	}
}

export function createWillr(config: IWillrConfig = { interval: 14 }) {
	return new WillrIndicator(config);
}
