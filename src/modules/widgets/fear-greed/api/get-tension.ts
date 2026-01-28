import { useHttpService } from '@/shared/service/http-service';
import { type ITension } from '../model';
import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';

const IS_USE_MOCK = true;

interface IGetTensionResponse {
	data: {
		current_value: number;
		current_zone: string;
		current_zone_description: string;
		last_updated: string; // ISO 8601 дата в формате строки
		has_data: boolean;
		historical: {
			yesterday: number;
			last_week: number;
			last_month: number;
		};
	};
}

export async function getTension(): Promise<ITension> {
	const logger = useLogger();
	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await fetchFromApi();

		return response;
	} catch (error) {
		logger.error('Failed to get market', { error: error as Error });
		throw error;
	}
}

async function fetchFromApi(): Promise<ITension> {
	const httpService = useHttpService();
	const { data } = await httpService.get<IGetTensionResponse>('/api/v1/fear-and-greed/data');

	const tension: ITension = {
		tension: data.current_value,
		history: [
			{
				displayName: 'Yesterday',
				name: 'yesterday',
				value: data.historical.yesterday,
			},
			{
				displayName: 'Last week',
				name: 'lastWeek',
				value: data.historical.last_week,
			},
			{
				displayName: 'Last month',
				name: 'lastMonth',
				value: data.historical.last_month,
			},
		],
	};

	return tension;
}

const { getMock } = useFetchMock<ITension>('/mock/widgets/fear-greed.json');

async function getMockData(): Promise<ITension> {

	return getMock();
}
