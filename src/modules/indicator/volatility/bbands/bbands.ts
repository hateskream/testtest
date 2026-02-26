import { BollingerBands as BollingerBandsSignal } from 'trading-signals';

import { Indicator, type IndicatorConfig, type IndicatorPoint } from '../../base';
import type { Candle } from '../../candle.ts';

export const BbandsSource = {
	Close: 'close',
	Open: 'open',
	High: 'high',
	Low: 'low',
} as const;

export type BbandsSourceType = (typeof BbandsSource)[keyof typeof BbandsSource];

export interface IBbandsConfig extends IndicatorConfig {
	interval: number;
	deviationMultiplier?: number;
	source?: BbandsSourceType;
}

export interface IBbandsResult {
	lower: number;
	middle: number;
	upper: number;
}

export class BbandsIndicator extends Indicator<IBbandsConfig> {
	private bbands: BollingerBandsSignal;

	constructor(config: IBbandsConfig) {
		super(config);

		this.bbands = new BollingerBandsSignal(
			this.config.interval,
			this.config.deviationMultiplier ?? 2,
		);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const source = this.getSource();
			const result = this.bbands.add(candle[source]);

			if (result !== null) {
				this.values.push({
					time: candle.time,
					value: result.middle,
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
		const result = this.bbands.update(candle[source], true);

		if (result === null) {
			return null;
		}

		const point = {
			time: candle.time,
			value: result.middle,
		};

		this.values.push(point);

		return point;
	}

	public reset(): void {
		this.values = [];
		this.bbands = new BollingerBandsSignal(
			this.config.interval,
			this.config.deviationMultiplier ?? 2,
		);
	}

	public getSource(): BbandsSourceType {
		return this.config.source ?? BbandsSource.Close;
	}

	public getBbandsResult(): IBbandsResult | null {
		const result = this.bbands.getResult();

		if (result === null) {
			return null;
		}

		return {
			lower: result.lower,
			middle: result.middle,
			upper: result.upper,
		};
	}
}

export function createBbands(
	config: IBbandsConfig = { interval: 20, deviationMultiplier: 2 },
) {
	return new BbandsIndicator(config);
}
