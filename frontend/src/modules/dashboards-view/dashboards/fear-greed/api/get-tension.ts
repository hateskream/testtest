import { useHttpService } from '@/shared/service/http-service';
import type { ITension } from '../model';

const IS_USE_MOCK = true;

export interface IGetTensionRequest {
	market: string;
}

export async function getTension({
	market,
}: IGetTensionRequest): Promise<ITension | null> {
	const httpService = useHttpService();

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<ITension>('/api/tension', {
					query: { market },
					// headers: { Authorization: `Bearer ${accessToken}` },
				});

		return response;
	} catch (error) {
		console.error(error);
	}

	return null;
}

async function getMockData(): Promise<ITension> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const response: ITension = {
		tension: 39,
		history: {
			yesterday: 3,
			lastWeek: 45,
			lastMonth: 69,
		},
	};

	return response;
}
