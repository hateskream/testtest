import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { delay, getImagePath, removeUndefinedPropertiesFromObject } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import type { IDominanceSnapshot } from '../model/dominance.ts';
import { useFetchMock } from '@/shared/mock';

const IS_USE_MOCK = true;

export interface IGetDominanceSnapshotRequest {
	tickers: string;
}

export interface IDominanceSnapshotResponse {
	data: IDominanceSnapshot[];
}

export interface IDominanceDomain extends IDominanceSnapshot {
	srcValue: string;
}

export async function getDominanceSnapshot(args: IGetDominanceSnapshotRequest): Promise<IDominanceDomain[]> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		const response = IS_USE_MOCK
			? await getMockData(args)
			: await httpService.get<IDominanceSnapshotResponse>('/api/bitcoin-dominance/snapshot', { query });

		return prepareResponse(response.data);
	} catch (error) {
		logger.error('Failed to get dominance snapshot', error as Error);
		throw error;
	}
}

function prepareResponse(data: IDominanceSnapshot[]): IDominanceDomain[] {
	return data.map(item => ({
		...item,
		srcValue: getImagePath(item.symbol, ImageTypePath.Currency),
	}));
}

const { getMock } = useFetchMock<IDominanceSnapshot[]>('/mock/widgets/dominance/snapshot.json');

async function getMockData(args: IGetDominanceSnapshotRequest) {
	await delay(500);

	const response = await getMock();

	return {
		data: response.filter(item => args.tickers.includes(item.symbol)),
	} as IDominanceSnapshotResponse;
}
