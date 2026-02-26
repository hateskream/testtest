import { StochasticRSI } from 'trading-signals';

import {
	Indicator,
	type IndicatorConfig,
	type IndicatorPoint,
} from '../../base';
import type { Candle } from '../../candle.ts';

export const StochRsiSource = {
	Close: 'close',
	Open: 'open',
	High: 'high',
	Low: 'low',
} as const;

export type StochRsiSourceType =
	(typeof StochRsiSource)[keyof typeof StochRsiSource];

export interface IStochRsiConfig extends IndicatorConfig {
	interval: number;
	source?: StochRsiSourceType;
}

export class StochRsiIndicator extends Indicator<IStochRsiConfig> {
	private stochrsi: StochasticRSI;

	constructor(config: IStochRsiConfig) {
		super(config);

		this.stochrsi = new StochasticRSI(this.config.interval);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const source = this.getSource();
			const value = this.stochrsi.add(candle[source]);

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
		const value = this.stochrsi.update(candle[source], true);

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
		this.stochrsi = new StochasticRSI(this.config.interval);
	}

	public getSource(): StochRsiSourceType {
		return this.config.source ?? StochRsiSource.Close;
	}
}

export function createStochRsi(config: IStochRsiConfig = { interval: 14 }) {
	return new StochRsiIndicator(config);
}
