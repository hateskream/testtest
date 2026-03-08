import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { IGetWhaleHoldingsRequest } from './contract.ts';
import { WhaleHoldingsSchema } from '../model';
import { apiSchema } from '@/shared/service/api';

const AddressesByHoldingsResponseMockSchema = WhaleHoldingsSchema.omit({
	tickerId: true,
});

type WhaleHoldingsResponseMock = z.infer<typeof AddressesByHoldingsResponseMockSchema>;

const { getMock } = useFetchMock<WhaleHoldingsResponseMock>('/mock/widgets/whale-holdings.json');

export async function getMockData(request: IGetWhaleHoldingsRequest) {
	await delay(2000);

	const response = await getMock();

	return apiSchema(WhaleHoldingsSchema).parse({
		tickerId: request.tickerId,
		...response,
	});
}
