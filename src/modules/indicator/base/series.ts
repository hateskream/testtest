import { type SeriesDefinition, type SeriesPartialOptionsMap, type SeriesType } from 'lightweight-charts';

export type SeriesConfig<T extends SeriesType> = {
	definition: SeriesDefinition<T>;
	options?: SeriesPartialOptionsMap[T];
	paneIndex?: number;
	isPrice?: boolean;
};

export function defineSeriesConfig<T extends SeriesType>(config: SeriesConfig<T>) {
	return config;
}
