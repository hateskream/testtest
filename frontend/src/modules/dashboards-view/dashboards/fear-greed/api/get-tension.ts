import { useHttpService } from '@/shared/service/http-service';
import type { ITension } from '../model';

const IS_USE_MOCK = true;

export interface IGetTensionRequest {
	market: string;
}

export async function getTension({ market }: IGetTensionRequest): Promise<ITension | null> {
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

export function getMockData(current: number = -1): ITension {
	// await new Promise(resolve => {
	// 	setTimeout(resolve, 0);
	// });

	const response: ITension = {
		tension: 19,
		history: {
			yesterday: 3,
			lastWeek: 45,
			lastMonth: 69,
		},
	};

	if (current !== -1) {
		let val;

		if (current <= 20) {
			val = Math.round(Math.random() * (39 - 20) + 20);
		} else if (current <= 40) {
			val = Math.round(Math.random() * (69 - 40) + 40);
		} else if (current <= 60) {
			val = Math.round(Math.random() * (89 - 60) + 60);
		} else if (current <= 80) {
			val = Math.round(Math.random() * (100 - 80) + 80);
		} else {
			val = Math.round(Math.random() * (19 - 1) + 1);
		}

		response.tension = val;
	}

	return response;
}
