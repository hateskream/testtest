import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { type IRealGdpHistory, type IRealGdpHistoryPoint, REAL_GDP_METRIC, RealGdpRange } from '../model';

const IS_USE_MOCK = false;

export interface IGetRealGdpRequest {
	range: RealGdpRange;
}

export interface IGetRealGdpResponse {
	range: RealGdpRange;
	metric: string;
	points: IRealGdpHistoryPoint[];
}

export async function getRealGdp(args: IGetRealGdpRequest): Promise<IRealGdpHistory> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(args);
		}

		const response = await httpService.get<IGetRealGdpResponse>('/api/v1/gdp/data', {
			query: {
				metric: REAL_GDP_METRIC,
				range: args.range,
			},
		});

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get Real GDP data', { error: error as Error });
		throw error;
	}
}

function prepareResponse(response: IGetRealGdpResponse): IRealGdpHistory {
	return {
		range: response.range,
		points: response.points,
	};
}

const { getMock } = useFetchMock<IGetRealGdpResponse>('/mock/widgets/gdp/real.json');

async function getMockData(_: IGetRealGdpRequest) {
	await delay(500);

	const response = await getMock();

	return prepareResponse(response);
}

