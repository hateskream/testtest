import { useHttpService } from '@/shared/service/http-service';
import type { ITension } from '../model';
import { useLogger } from '@/shared/service/logger';

const IS_USE_MOCK = true;
let mockCurrentTension = 85;

export interface IGetTensionRequest {
	market: string;
}

export async function getTension({ market }: IGetTensionRequest): Promise<ITension> {
	const httpService = useHttpService();
	const logger = useLogger();
	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<ITension>('/api/tension', {
				query: { market },
			});

		return response;
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

export async function getMockData(): Promise<ITension> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const response: ITension = {
		tension: mockCurrentTension,
		history: [
			{
				displayName: 'Yesterday',
				name: 'yesterday',
				value: 3,
			},
			{
				displayName: 'Last week',
				name: 'lastWeek',
				value: 45,
			},
			{
				displayName: 'Last month',
				name: 'lastMonth',
				value: 69,
			},
		],
	};

	if (mockCurrentTension !== -1) {
		if (mockCurrentTension <= 20) {
			mockCurrentTension = Math.round(Math.random() * (39 - 20) + 20);
		} else if (mockCurrentTension <= 40) {
			mockCurrentTension = Math.round(Math.random() * (59 - 40) + 40);
		} else if (mockCurrentTension <= 60) {
			mockCurrentTension = Math.round(Math.random() * (79 - 60) + 60);
		} else if (mockCurrentTension <= 80) {
			mockCurrentTension = Math.round(Math.random() * (100 - 80) + 80);
		} else {
			mockCurrentTension = Math.round(Math.random() * (19 - 1) + 1);
		}

		response.tension = mockCurrentTension;
	}

	return response;
}
