import type { Candle } from '../candle.ts';

export type IndicatorConfig = {
	id?: string;
	name?: string;
};

export type IndicatorPoint<T = number> = {
	time: number;
	value: T;
};

export type IndicatorResult<T = number> = {
	id: string;
	name: string;
	values: IndicatorPoint<T>[];
};

export abstract class Indicator<
	TConfig extends IndicatorConfig = IndicatorConfig,
	TValue = number,
> {
	protected readonly id: string;
	protected readonly name: string;
	protected readonly config: TConfig;

	protected values: IndicatorPoint<TValue>[] = [];
	protected candles: Candle[] = [];

	constructor(config: TConfig) {
		this.id = config.id ?? crypto.randomUUID();
		this.name = config.name ?? this.constructor.name;
		this.config = config;
	}

	abstract calculate(data: Candle[]): void;

	abstract update(candle: Candle, isFinal?: boolean): IndicatorPoint<TValue> | null;

	abstract reset(): void;

	public getResult(): IndicatorResult<TValue> {
		return {
			id: this.id,
			name: this.name,
			values: this.values,
		};
	}

	public getLastPoint(): IndicatorPoint<TValue> | null {
		if (this.values.length === 0) {
			return null;
		}

		return { ...this.values[this.values.length - 1] };
	}
}
