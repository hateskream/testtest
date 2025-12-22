import { type IGetNewsRequest, type IGetNewsResponse } from '@/modules/news';
import { useFetchMock } from '@/shared/mock';

const { getMock } = useFetchMock<IGetNewsResponse>('/mock/widgets/news.json');

export async function getMockNewsData(_req: Partial<IGetNewsRequest> = {}) {
	const res = await getMock();

	return {
		...res,
		data: res.data.slice(0, _req.limit),
	};
}
