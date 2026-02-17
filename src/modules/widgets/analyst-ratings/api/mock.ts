import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';
import { AnalystRatingsSchema } from '../model';


const { getMock } = useFetchMock('/mock/widgets/analyst-ratings.json');

export async function getMockData() {
	await delay(2000);

	const tickers = await getMock();
	const preparedTickers = AnalystRatingsSchema.parse(tickers);

	return {
		...preparedTickers,
	};
}
