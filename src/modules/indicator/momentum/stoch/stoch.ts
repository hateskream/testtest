import { StochasticOscillator } from 'trading-signals';

import { Indicator, type IndicatorConfig, type IndicatorPoint } from '../../base';
import type { Candle } from '../../candle.ts';

export interface IStochConfig extends IndicatorConfig {
	kPeriod: number;
	dPeriod: number;
	smoothK: number;
}

export interface IStochResult {
	stochK: number;
	stochD: number;
}

export class StochIndicator extends Indicator<IStochConfig> {
	private stoch: StochasticOscillator;

	constructor(config: IStochConfig) {
		super(config);

		this.stoch = new StochasticOscillator(
			this.config.smoothK,
			this.config.kPeriod,
			this.config.dPeriod,
		);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const result = this.stoch.add({
				high: candle.high,
				low: candle.low,
				close: candle.close,
			});

			if (result !== null) {
				this.values.push({
					time: candle.time,
					value: result.stochK,
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

		const result = this.stoch.update(
			{
				high: candle.high,
				low: candle.low,
				close: candle.close,
			},
			true,
		);

		if (result === null) {
			return null;
		}

		const point = {
			time: candle.time,
			value: result.stochK,
		};

		this.values.push(point);

		return point;
	}

	public reset(): void {
		this.values = [];
		this.stoch = new StochasticOscillator(
			this.config.smoothK,
			this.config.kPeriod,
			this.config.dPeriod,
		);
	}

	public getStochResult(): IStochResult | null {
		const result = this.stoch.getResult();

		if (result === null) {
			return null;
		}

		return {
			stochK: result.stochK,
			stochD: result.stochD,
		};
	}
}

export function createStoch(
	config: IStochConfig = { kPeriod: 14, dPeriod: 3, smoothK: 3 },
) {
	return new StochIndicator(config);
}
