import { EMA, MACD as MACDSignal } from 'trading-signals';

import { Indicator, type IndicatorConfig, type IndicatorPoint } from '../../base';
import type { Candle } from '../../candle.ts';

export const MacdSource = {
	Close: 'close',
	Open: 'open',
	High: 'high',
	Low: 'low',
} as const;

export type MacdSourceType = (typeof MacdSource)[keyof typeof MacdSource];

export interface IMacdConfig extends IndicatorConfig {
	fastPeriod: number;
	slowPeriod: number;
	signalPeriod: number;
	source?: MacdSourceType;
}

export interface IMacdResult {
	macd: number;
	signal: number;
	histogram: number;
}

export class MacdIndicator extends Indicator<IMacdConfig> {
	private macd: MACDSignal;

	constructor(config: IMacdConfig) {
		super(config);

		const fastEMA = new EMA(this.config.fastPeriod);
		const slowEMA = new EMA(this.config.slowPeriod);
		const signalEMA = new EMA(this.config.signalPeriod);

		this.macd = new MACDSignal(fastEMA, slowEMA, signalEMA);
	}

	public calculate(candles: Candle[]): void {
		this.reset();

		this.candles = [...candles];

		for (const candle of this.candles) {
			const source = this.getSource();
			const result = this.macd.add(candle[source]);

			if (result !== null) {
				this.values.push({
					time: candle.time,
					value: result.macd,
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
		const result = this.macd.update(candle[source], true);

		if (result === null) {
			return null;
		}

		const point = {
			time: candle.time,
			value: result.macd,
		};

		this.values.push(point);

		return point;
	}

	public reset(): void {
		this.values = [];

		const fastEMA = new EMA(this.config.fastPeriod);
		const slowEMA = new EMA(this.config.slowPeriod);
		const signalEMA = new EMA(this.config.signalPeriod);

		this.macd = new MACDSignal(fastEMA, slowEMA, signalEMA);
	}

	public getSource(): MacdSourceType {
		return this.config.source ?? MacdSource.Close;
	}

	public getMacdResult(): IMacdResult | null {
		const result = this.macd.getResult();

		if (result === null) {
			return null;
		}

		return {
			macd: result.macd,
			signal: result.signal,
			histogram: result.histogram,
		};
	}
}

export function createMacd(
	config: IMacdConfig = { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
) {
	return new MacdIndicator(config);
}
