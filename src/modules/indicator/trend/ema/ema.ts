import { EMA } from 'trading-signals';

import { Indicator, type IndicatorConfig, type IndicatorPoint } from '../../base';
import type { Candle } from '../../candle.ts';

export const EmaSource = {
	Close: 'close',
	Open: 'open',
	High: 'high',
	Low: 'low',
} as const;

export type EmaSourceType = typeof EmaSource[keyof typeof EmaSource];

export interface IEmaConfig extends IndicatorConfig {
	period: number;
	source?: EmaSourceType;
}

export class EmaIndicator extends Indicator<IEmaConfig> {
	private ema: EMA;

	constructor(config: IEmaConfig) {
		super(config);

		this.ema = new EMA(this.config.period);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const source = this.getSource();
			const value = this.ema.add(candle[source]);

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

		const source = this.getSource();
		const value = this.ema.update(candle[source], true);

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
		this.ema = new EMA(this.config.period);
	}

	public getSource(): EmaSourceType {
		return this.config.source ?? EmaSource.Close;
	}
}

export function createEma(config: IEmaConfig = { period: 9 }) {
	return new EmaIndicator(config);
}
