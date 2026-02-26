import { WMA } from 'trading-signals';

import {
	Indicator,
	type IndicatorConfig,
	type IndicatorPoint,
} from '../../base';
import type { Candle } from '../../candle.ts';

export const WmaSource = {
	Close: 'close',
	Open: 'open',
	High: 'high',
	Low: 'low',
} as const;

export type WmaSourceType = (typeof WmaSource)[keyof typeof WmaSource];

export interface IWmaConfig extends IndicatorConfig {
	interval: number;
	source?: WmaSourceType;
}

export class WmaIndicator extends Indicator<IWmaConfig> {
	private wma: WMA;

	constructor(config: IWmaConfig) {
		super(config);

		this.wma = new WMA(this.config.interval);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const source = this.getSource();
			const value = this.wma.add(candle[source]);

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
		const value = this.wma.update(candle[source], true);

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
		this.wma = new WMA(this.config.interval);
	}

	public getSource(): WmaSourceType {
		return this.config.source ?? WmaSource.Close;
	}
}

export function createWma(config: IWmaConfig = { interval: 9 }) {
	return new WmaIndicator(config);
}
