import { SMA } from 'trading-signals';

import type { ICandle } from '@/modules/chart';
import { Indicator, type IndicatorConfig, type IndicatorPoint } from '../base';

export const SmaSource = {
	Close: 'close',
	Open: 'open',
	High: 'high',
	Low: 'low',
} as const;

export type SmaSourceType = typeof SmaSource[keyof typeof SmaSource];

export interface ISmaConfig extends IndicatorConfig {
	period: number;
	source?: SmaSourceType;
}

export class SmaIndicator extends Indicator<ISmaConfig> {
	private sma: SMA;

	constructor(config: ISmaConfig) {
		super(config);

		this.sma = new SMA(this.config.period);
	}

	public calculate(candles: ICandle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const source = this.getSource();
			const value = this.sma.update(candle[source], true);

			if (value !== null) {
				this.values.push({
					time: candle.time,
					value,
				});
			}
		}
	}

	public update(candle: ICandle): IndicatorPoint | null {
		const lastCandle = this.candles[this.candles.length - 1];

		if (lastCandle && lastCandle.time === candle.time) {
			this.candles[this.candles.length - 1] = { ...candle };
			this.calculate(this.candles);
			return this.getLastPoint();
		}

		this.candles.push({ ...candle });

		const source = this.getSource();
		const value = this.sma.update(candle[source], true);

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
		this.sma = new SMA(this.config.period);
	}

	public getSource(): SmaSourceType {
		return this.config.source ?? SmaSource.Close;
	}
}

export function createSma(config: ISmaConfig) {
	return new SmaIndicator(config);
}
