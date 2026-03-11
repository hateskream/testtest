import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { apiSchema } from '@/shared/service/api';
import type { ISeasonalsRequest } from './contract';
import { SeasonalsResponseSchema } from '../model';

const SeasonalsMockSchema = SeasonalsResponseSchema.omit({ tickerId: true });

type SeasonalsMock = z.infer<typeof SeasonalsMockSchema>;

const { getMock } = useFetchMock<SeasonalsMock>('/mock/widgets/seasonals.json');

export async function getMockData(request: ISeasonalsRequest) {
	await delay(1000);

	const response = await getMock();

	return apiSchema(SeasonalsResponseSchema).parse({
		tickerId: request.tickerId,
		currency: request.currency,
		series: response.series,
	});
}
