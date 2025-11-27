import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { delay, getImagePath, removeUndefinedPropertiesFromObject } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import { useFetchMock } from '@/shared/mock';

const IS_USE_MOCK = false;

export interface IGetDominanceSnapshotRequest {
	tickers: string;
}

interface IDominanceSnapshotApiResponse {
	changeWeek: number;
	changeYear: number;
	changeYerstaday: number;
	color: string;
	dominance: number;
	id: string;
	symbol: string;
	name?: string;
}

export interface IDominanceSnapshotResponse {
	data: IDominanceSnapshotApiResponse[];
}

export interface IDominanceDomain {
	id: string;
	symbol: string;
	name: string;
	dominance: {
		current: number;
		yesterday: number;
		week: number;
		year: number;
	};
	color: string;
	srcValue: string;
}

export async function getDominanceSnapshot(args: IGetDominanceSnapshotRequest): Promise<IDominanceDomain[]> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);
	if (query.tickers) {
		if (query.tickers.match(/(?<=-)[^_]+(?=_)/g)?.join(',') !== null) {
			query.tickers = query.tickers.match(/(?<=-)[^_]+(?=_)/g)!.join(',');
		}
	}

	try {
		const response = IS_USE_MOCK
			? await getMockData(args)
			: await httpService.get<IDominanceSnapshotResponse>('/api/v1/dominance/data', { query });

		const result = prepareResponse(response.data);

		return result;
	} catch (error) {
		logger.error('Failed to get dominance snapshot', error as Error);
		throw error;
	}
}

function prepareResponse(data: IDominanceSnapshotApiResponse[]): IDominanceDomain[] {
	return data.map(item => ({
		id: item.id,
		symbol: item.symbol,
		name: item.name || item.symbol,
		dominance: {
			current: item.dominance,
			yesterday: item.changeYerstaday,
			week: item.changeWeek,
			year: item.changeYear,
		},
		color: item.color,
		srcValue: getImagePath(item.symbol, ImageTypePath.Currency),
	}));
}

const { getMock } = useFetchMock<IDominanceSnapshotApiResponse[]>('/mock/widgets/dominance/snapshot.json');

async function getMockData(args: IGetDominanceSnapshotRequest) {
	await delay(500);

	const response = await getMock();

	return {
		data: response.filter(item => args.tickers.includes(item.symbol)),
	} as IDominanceSnapshotResponse;
}
