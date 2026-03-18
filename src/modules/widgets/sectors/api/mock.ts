import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { ISectorsRequest } from './contract';
import { MarketType } from '@/modules/market';
import {
	CommoditySectorsSchema,
	CryptoSectorsSchema,
	EtfSectorsSchema,
	ForexSectorsSchema,
	IndexSectorsSchema,
	SectorsAnalysisSchema,
	StockSectorsSchema,
} from '../model';
import { apiSchema } from '@/shared/service/api';
import { resolveMarketTypeFromTicker } from '@/modules/cell';

const SectorsResponseMockSchema = apiSchema(z.object({
	[MarketType.Crypto]: CryptoSectorsSchema.omit({ tickerId: true }),
	[MarketType.Stock]: StockSectorsSchema.omit({ tickerId: true }),
	[MarketType.Forex]: ForexSectorsSchema.omit({ tickerId: true }),
	[MarketType.Etf]: EtfSectorsSchema.omit({ tickerId: true }),
	[MarketType.Indices]: IndexSectorsSchema.omit({ tickerId: true }),
	[MarketType.Commodities]: CommoditySectorsSchema.omit({ tickerId: true }),
}));

const { getMock } = useFetchMock('/mock/widgets/sectors.json');

export async function getMockData(request: ISectorsRequest) {
	await delay(2000);

	const tickers = await getMock();
	const market = resolveMarketTypeFromTicker(request.tickerId)!;

	const preparedTickers = SectorsResponseMockSchema.parse(tickers);

	return {
		tickerId: request.tickerId,
		...preparedTickers[market],
	};
}

interface IGetAnalysisMock {
	summary: string;
}

const { getMock: getAnalysisMock } = useFetchMock<IGetAnalysisMock>('/mock/widgets/sectors-analysis.json');

export async function getAnalysisMockData(request: ISectorsRequest) {
	await delay(1000);

	const response = await getAnalysisMock();

	return apiSchema(SectorsAnalysisSchema).parse({
		tickerId: request.tickerId,
		...response,
	});
}
