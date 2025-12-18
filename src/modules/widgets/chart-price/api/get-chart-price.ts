import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { delay } from '@/shared/lib';
import type { MarketType } from '@/modules/market';
import { type IChartPriceData, TimeRangeFilterValue } from '../model';

const IS_USE_MOCK = false;

export interface IGetChartPriceRequest {
	tickerID: string;
	market: MarketType;
	range: TimeRangeFilterValue;
}

export interface IGetChartPriceResponse {
	ticker: string;
	range: TimeRangeFilterValue;
	data: {
		points: {
			timestamp: string;
			price: number;
			changePercent: number;
			delta: number;
		}[];
		current: {
			price: number;
			changePercent: number;
			delta: number;
			updatedAt: string;
		};
	};
}

export async function getChartPrice(request: IGetChartPriceRequest): Promise<IChartPriceData> {
	const httpService = useHttpService();
	const logger = useLogger();

	if (IS_USE_MOCK) {
		return await getMockData(request);
	}

	const query = requestToQuery(request);

	try {
		const response = await httpService.get<IGetChartPriceResponse>(
			'/api/v1/price_chart/data',
			{ query },
		);

		return mapResponseToDomain(response);
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

function requestToQuery(request: IGetChartPriceRequest) {
	return {
		tickerID: request.tickerID,
		market: request.market,
		range: request.range,
	};
}

function mapResponseToDomain(response: IGetChartPriceResponse): IChartPriceData {
	return {
		points: response.data.points.map(point => ({
			timestamp: Date.parse(point.timestamp),
			price: point.price,
			changePercent: point.changePercent,
			delta: point.delta,
		})),
		current: response.data.current,
	};
}

async function getMockData(_: IGetChartPriceRequest): Promise<IChartPriceData> {
	await delay(500);

	const now = Date.now();

	return {
		points: Array.from({ length: 100 }).map((_it, key) => ({
			timestamp: now + key * 60000,
			price: 99000 - (100 - key) * 10,
			changePercent: 0,
			delta: 0,
		})),
		current: {
			price: 99000,
			changePercent: 2.52453,
			delta: 2.52453,
			updatedAt: '2025-12-04T00:00:00.000Z',
		},
	};
}
