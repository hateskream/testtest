import { RMA } from 'trading-signals';

import {
	Indicator,
	type IndicatorConfig,
	type IndicatorPoint,
} from '../../base';
import type { Candle } from '../../candle.ts';

export const RmaSource = {
	Close: 'close',
	Open: 'open',
	High: 'high',
	Low: 'low',
} as const;

export type RmaSourceType = (typeof RmaSource)[keyof typeof RmaSource];

export interface IRmaConfig extends IndicatorConfig {
	interval: number;
	source?: RmaSourceType;
}

export class RmaIndicator extends Indicator<IRmaConfig> {
	private rma: RMA;

	constructor(config: IRmaConfig) {
		super(config);

		this.rma = new RMA(this.config.interval);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const source = this.getSource();
			const value = this.rma.add(candle[source]);

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
		const value = this.rma.update(candle[source], true);

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
		this.rma = new RMA(this.config.interval);
	}

	public getSource(): RmaSourceType {
		return this.config.source ?? RmaSource.Close;
	}
}

export function createRma(config: IRmaConfig = { interval: 14 }) {
	return new RmaIndicator(config);
}
