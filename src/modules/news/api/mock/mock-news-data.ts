import { type IGetNewsResponse } from '@/modules/news';
import { useFetchMock } from '@/shared/mock';

const { getMock } = useFetchMock<IGetNewsResponse>('/mock/widgets/news.json');

export function getMockNewsData(_req = {}) {
	return getMock();
}
