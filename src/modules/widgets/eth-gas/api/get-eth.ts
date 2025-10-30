import type { IGasCardData, IGasStatsData } from '../model';
import { useLogger } from '@/shared/service/logger';


export interface IGasResponse {
	gasStats: IGasStatsData;
	gasCardData: IGasCardData[];
}
export async function getEth(): Promise<IGasResponse> {
	const logger = useLogger();
	try {

		const response = await getMockData();


		return response;
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}


async function getMockData(): Promise<IGasResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const gasData = [
		{ type: 'slow', gwei: 0.28, time: 45, price: 0.02 },
		{ type: 'standard', gwei: 0.35, time: 20, price: 0.01 },
		{ type: 'fast', gwei: 0.39, time: 15, price: 0.03 },
	] as IGasCardData[];


	const statsData = {
		lastBlock: 23181923,
		avgBlockSize: 217,
		pendingQueue: 129965,
		avgUtilization: 47.7,
	} as IGasStatsData;

	return { gasCardData:gasData, gasStats: statsData };
}
