import { useFetchMock } from '@/shared/mock';
import type { IGetNewsDetailsRequest } from '@/modules/news';
import type { IGetNewsDetailsResponse } from '../get-news-details-data.ts';

const { getMock } = useFetchMock<IGetNewsDetailsResponse>('/mock/widgets/news-details.json');

export async function getMockNewsDetailsData(_req: IGetNewsDetailsRequest) {
	return getMock();
}
