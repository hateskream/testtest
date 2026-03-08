import { z } from 'zod';

import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import type { IGetAddressesByHoldingsRequest } from './get-addresses-by-holdings.ts';
import { AddressesByHoldingsSchema } from '../model';
import { apiSchema } from '@/shared/service/api';

const AddressesByHoldingsResponseMockSchema = AddressesByHoldingsSchema.omit({
	tickerId: true,
});

type AddressesByHoldingsResponseMock = z.infer<typeof AddressesByHoldingsResponseMockSchema>;

const { getMock } = useFetchMock<AddressesByHoldingsResponseMock>('/mock/widgets/addresses-by-holdings.json');

export async function getMockData(request: IGetAddressesByHoldingsRequest) {
	await delay(2000);

	const response = await getMock();

	return apiSchema(AddressesByHoldingsSchema).parse({
		tickerId: request.tickerId,
		...response,
	});
}
