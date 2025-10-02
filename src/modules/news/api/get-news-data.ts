import { useHttpService } from '@/shared/service/http-service';
import { type IGetNewsRequest, type INews } from '../model';
import { useLogger } from '@/shared/service/logger';
import { arrayToString, getImagePath } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import { getMockNewsData } from '@/modules/news/api/mock/mock-news-data.ts';

const IS_USE_MOCK = true;

export interface IPagination {
	total: number;
	offset: number;
	limit: number;
}

export interface IGetNewsResponse {
	data: INews[];
	pagination: IPagination;
}

export async function getNews(req: IGetNewsRequest): Promise<IGetNewsResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = createQuery(req);

	try {
		const response = IS_USE_MOCK
			? await getMockNewsData(req)
			: await httpService.get<IGetNewsResponse>(`/api/news?${query}`);

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get news', error as Error);
		throw error;
	}
}

function createQuery({
	offset,
	limit,
	score,
	segment,
	sentiment,
	source,
	selectedTickers,
	activeSort,
	locations,
}: IGetNewsRequest): string {
	const params = new URLSearchParams({
		offset: offset.toString(),
		limit: 	limit.toString(),
	});

	locations.forEach(item => {
		params.append('region', item.region);
		item.countries.forEach(country => {
			params.append('countries', country);
		});
	});

	if (score.size) {
		params.append('score', arrayToString(Array.from(score)));
	}

	if (segment.isAllTickersShow) {
		params.append('isAllTickersShow', 'true');
	}

	if (segment.selectAllFrom.length) {
		params.append('selectAllFrom', arrayToString(segment.selectAllFrom));
	}

	if (segment.selectTickers.length) {
		params.append('selectTickers', arrayToString(segment.selectTickers));
	}

	if (sentiment.size) {
		params.append('sentiment', arrayToString(Array.from(sentiment)));
	}

	if (source.size) {
		params.append('source', arrayToString(Array.from(source)));
	}

	if (selectedTickers.length) {
		params.append('tickers', arrayToString(selectedTickers));
	}

	if (activeSort) {
		params.append('sort', activeSort);
	}

	return params.toString();
}

function prepareResponse({ data, pagination }: IGetNewsResponse): IGetNewsResponse {
	return {
		pagination,
		data: data.map(item => ({
			...item,
			srcSourceImage: '',
			stocks: item.stocks.map(stock => ({
				...stock,
				srcImage: getImagePath(stock.ticker, ImageTypePath.Stock),
			})),
		})),
	};
}
