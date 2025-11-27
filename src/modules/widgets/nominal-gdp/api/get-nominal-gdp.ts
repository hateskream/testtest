import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { type INominalGdpHistory, type INominalGdpHistoryPoint, NOMINAL_GDP_METRIC, NominalGdpRange } from '../model';

const IS_USE_MOCK = false;

export interface IGetNominalGdpRequest {
	range: NominalGdpRange;
}

export interface IGetNominalGdpResponse {
	range: NominalGdpRange;
	metric: string;
	points: INominalGdpHistoryPoint[];
}

export async function getNominalGdp(args: IGetNominalGdpRequest): Promise<INominalGdpHistory> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(args);
		}

		const response = await httpService.get<IGetNominalGdpResponse>('/api/v1/gdp/data', {
			query: {
				metric: NOMINAL_GDP_METRIC,
				range: args.range,
			},
		});

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get Nominal GDP data', error as Error);
		throw error;
	}
}

function prepareResponse(response: IGetNominalGdpResponse): INominalGdpHistory {
	return {
		range: response.range,
		points: preparePoints(response.points, response.range),
	};
}

function preparePoints(points: INominalGdpHistoryPoint[], range: NominalGdpRange) {
	if (range === NominalGdpRange.TwentyFiveYears || range === NominalGdpRange.All) {
		return points.filter((_, key) => key % 3 === 0);
	}

	return points;
}

const { getMock } = useFetchMock<IGetNominalGdpResponse>('/mock/widgets/gdp/nominal.json');

async function getMockData(_: IGetNominalGdpRequest) {
	await delay(500);

	const response = await getMock();

	return prepareResponse(response);
}

