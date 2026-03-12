import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import { delay } from '@/shared/lib';

const IS_USE_MOCK = false;

export interface IEconomicOutlineRequest {
	tickerId: string;
}

export interface IEconomicOutlineResponse {
	status: 'optimistic' | 'pessimistic' | 'neutral';
	text: string;
	summarized_date: string;
}

export function getEconomicOutline(args: IEconomicOutlineRequest): Promise<IEconomicOutlineResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData(args);
		}

		return httpService.get<IEconomicOutlineResponse>('/api/v1/economic-outline/data', {
			query: {
				ticker_id: args.tickerId,
			},
		});
	} catch (error) {
		logger.error('Failed to get economic outline', { error: error as Error });
		throw error;
	}
}

async function getMockData(_: IEconomicOutlineRequest): Promise<IEconomicOutlineResponse> {
	await delay(500);

	return {
		status: 'optimistic',
		text: 'UK\'s MPC votes shifted to 0-1-8, Bank Rate stable at 4.5%.' +
			'SNB lowers rate to 0.25%. AU job losses surged to 52.8K, UK claimants up to 44.2K.',
		summarized_date: '2026-02-04T12:30:37Z',
	};
}
