import { AO as AOSignal } from 'trading-signals';

import {
	Indicator,
	type IndicatorConfig,
	type IndicatorPoint,
} from '../../base';
import type { Candle } from '../../candle.ts';

export interface IAOConfig extends IndicatorConfig {
	shortInterval: number;
	longInterval: number;
}

export class AOIndicator extends Indicator<IAOConfig> {
	private ao: AOSignal;

	constructor(config: IAOConfig) {
		super(config);

		this.ao = new AOSignal(this.config.shortInterval, this.config.longInterval);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const value = this.ao.add({ high: candle.high, low: candle.low });

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

		const value = this.ao.update({ high: candle.high, low: candle.low }, true);

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
		this.ao = new AOSignal(this.config.shortInterval, this.config.longInterval);
	}
}

export function createAO(
	config: IAOConfig = { shortInterval: 5, longInterval: 34 },
) {
	return new AOIndicator(config);
}
