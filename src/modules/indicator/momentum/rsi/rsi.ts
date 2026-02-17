import { RSI } from 'trading-signals';

import { Indicator, type IndicatorConfig, type IndicatorPoint } from '../../base';
import type { Candle } from '../../candle.ts';

export const RsiSource = {
	Close: 'close',
	Open: 'open',
	High: 'high',
	Low: 'low',
} as const;

export type RsiSourceType = typeof RsiSource[keyof typeof RsiSource];

export interface IRsiConfig extends IndicatorConfig {
	interval: number;
	source?: RsiSourceType;
}

export class RsiIndicator extends Indicator<IRsiConfig> {
	private rsi: RSI;

	constructor(config: IRsiConfig) {
		super(config);

		this.rsi = new RSI(this.config.interval);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const source = this.getSource();
			const value = this.rsi.add(candle[source]);

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
		const value = this.rsi.update(candle[source], true);

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
		this.rsi = new RSI(this.config.interval);
	}

	public getSource(): RsiSourceType {
		return this.config.source ?? RsiSource.Close;
	}
}

export function createRsi(config: IRsiConfig = { interval: 14 }) {
	return new RsiIndicator(config);
}
