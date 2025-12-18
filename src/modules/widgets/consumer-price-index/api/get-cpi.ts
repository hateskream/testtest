import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { CpiRange, type ICpiHistory } from '../model';

const IS_USE_MOCK = false;

export interface IGetCpiRequest {
	range: CpiRange;
}

export async function getCpi(args: IGetCpiRequest): Promise<ICpiHistory> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(args);
		}

		return await httpService.get<ICpiHistory>('/api/v1/cpi/data', {
			query: {
				range: args.range,
			},
		});
	} catch (error) {
		logger.error('Failed to get CPI data', error as Error);
		throw error;
	}
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

