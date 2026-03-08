import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { apiSchema } from '@/shared/service/api';
import { PriceTargetSchema, type PriceTarget } from '../model';

const ResponseSchema = apiSchema(PriceTargetSchema);

const { getMock } = useFetchMock<unknown>('/mock/widgets/price-target.json');

export async function getMockData(): Promise<PriceTarget> {
	await delay(500);

	const raw = await getMock();

	return ResponseSchema.parse(raw);
}
