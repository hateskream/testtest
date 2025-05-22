import type { CandlestickData } from 'lightweight-charts';

import type { TypeChart } from '../model';


export function prepareLineDataFromCandlestick(data: CandlestickData[]) {
	return data.map(item => ({ time: item.time, value: item.close }));
}

export function prepareSeries(data: CandlestickData[], type: TypeChart) {
	switch (type) {
		case 'Line':
			{
				return prepareLineDataFromCandlestick(data);
			};
		case 'Candlestick': {
			return data;
		}


		default:
			return data;

	}

}
