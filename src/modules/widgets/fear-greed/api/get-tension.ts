import { useHttpService } from '@/shared/service/http-service';
import { Tension, type ITension } from '../model';
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

function getRandomFromRange(max: number, min: number) {
	return Math.round(Math.random() * (max - min) + min);
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
		if (mockCurrentTension <= Tension.extremeFear.max) {
			mockCurrentTension = getRandomFromRange(Tension.fear.max, Tension.fear.min);
		} else if (mockCurrentTension <= Tension.fear.max) {
			mockCurrentTension = getRandomFromRange(Tension.neutral.max, Tension.neutral.min);
		} else if (mockCurrentTension <= Tension.neutral.max) {
			mockCurrentTension = getRandomFromRange(Tension.greed.max, Tension.greed.min);
		} else if (mockCurrentTension <= Tension.greed.max) {
			mockCurrentTension = getRandomFromRange(Tension.extremeGreed.max, Tension.extremeGreed.min);
		} else {
			mockCurrentTension = getRandomFromRange(Tension.extremeFear.max, Tension.extremeFear.min);
		}

		response.tension = mockCurrentTension;
	}

	return response;
}
