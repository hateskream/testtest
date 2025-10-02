import { useHttpService } from '@/shared/service/http-service';
import { Tension, type ITension } from '../model';
import { useLogger } from '@/shared/service/logger';

const IS_USE_MOCK = true;
let mockCurrentTension = 85;

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
		logger.error('Failed to get market', error as Error);
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

function getRandomFromRange(max: number, min: number) {
	return Math.round(Math.random() * (max - min) + min);
}

async function getMockData(): Promise<ITension> {
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
