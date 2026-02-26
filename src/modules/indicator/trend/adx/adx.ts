import { ADX as ADXSignal } from 'trading-signals';

import {
	Indicator,
	type IndicatorConfig,
	type IndicatorPoint,
} from '../../base';
import type { Candle } from '../../candle.ts';

export interface IAdxConfig extends IndicatorConfig {
	interval: number;
}

export class AdxIndicator extends Indicator<IAdxConfig> {
	private adx: ADXSignal;

	constructor(config: IAdxConfig) {
		super(config);

		this.adx = new ADXSignal(this.config.interval);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const value = this.adx.add({
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

		const value = this.adx.update(
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
		this.adx = new ADXSignal(this.config.interval);
	}
}

export function createAdx(config: IAdxConfig = { interval: 14 }) {
	return new AdxIndicator(config);
}
