import { DEMA } from 'trading-signals';

import {
	Indicator,
	type IndicatorConfig,
	type IndicatorPoint,
} from '../../base';
import type { Candle } from '../../candle.ts';

export const DemaSource = {
	Close: 'close',
	Open: 'open',
	High: 'high',
	Low: 'low',
} as const;

export type DemaSourceType = (typeof DemaSource)[keyof typeof DemaSource];

export interface IDemaConfig extends IndicatorConfig {
	interval: number;
	source?: DemaSourceType;
}

export class DemaIndicator extends Indicator<IDemaConfig> {
	private dema: DEMA;

	constructor(config: IDemaConfig) {
		super(config);

		this.dema = new DEMA(this.config.interval);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const source = this.getSource();
			const value = this.dema.add(candle[source]);

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
		const value = this.dema.update(candle[source], true);

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
		this.dema = new DEMA(this.config.interval);
	}

	public getSource(): DemaSourceType {
		return this.config.source ?? DemaSource.Close;
	}
}

export function createDema(config: IDemaConfig = { interval: 9 }) {
	return new DemaIndicator(config);
}
