import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { CpiMetric, CpiRange, type ICpiHistory, type ICpiHistoryPoint } from '../model';

const IS_USE_MOCK = false;

export interface IGetCpiRequest {
	metric: CpiMetric;
	range: CpiRange;
}

export async function getCpi(args: IGetCpiRequest): Promise<ICpiHistory> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(args);
		}

		const response = await httpService.get<ICpiHistory>('/api/v1/cpi/data', {
			query: {
				metric: args.metric,
				range: args.range,
			},
		});

		// TODO: Убрать после фикса бекенда по количеству точек
		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get CPI data', error as Error);
		throw error;
	}
}

function prepareResponse(history: ICpiHistory) {
	return {
		range: history.range,
		growth_yoy: history.growth_yoy,
		points: preparePoints(history.points, history.range),
	};
}

function preparePoints(points: ICpiHistoryPoint[], range: CpiRange) {
	if (range === CpiRange.ThreeYears) {
		return points.filter((_, key) => key % 3 === 0);
	}

	if (range === CpiRange.FiveYears) {
		return points.filter((_, key) => key % 6 === 0);
	}

	if (range === CpiRange.TenYears || range === CpiRange.All) {
		return points.filter((_, key) => key % 12 === 0);
	}

	return points;
}

const { getMock } = useFetchMock<ICpiHistory>('/mock/widgets/cpi.json');

async function getMockData(args: IGetCpiRequest) {
	await delay(500);

	const response = await getMock();

	return {
		...response,
		range: args.range,
	};
}

