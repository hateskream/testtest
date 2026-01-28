import { useHttpService } from '@/shared/service/http-service.ts';
import { useLogger } from '@/shared/service/monitoring';
import { delay } from '@/shared/lib';
import type { ISocialsItem, IWebsite } from '../model/links';

const IS_USE_MOCK = true;

export interface ILinksTabsResponse {
	ticker_id: string;
	website?: IWebsite;
	socials?: ISocialsItem[];
	tags?: string[];
}

export interface ILinksTabsRequest {
	ticker_id: string;
}

export function getLinksTabs(request: ILinksTabsRequest) {
	return IS_USE_MOCK ? getMockLinksTabs() : getApiLinksTabs(request);
}

async function getApiLinksTabs(request: ILinksTabsRequest) {
	const http = useHttpService();

	try {
		return http.get<ILinksTabsResponse>('/api/v1/widget/links', {
			query: {
				ticker_id: request.ticker_id,
			},
		});
	} catch (error) {
		const logger = useLogger();
		logger.error('Failed to get news', { error: error as Error });
		throw error;
	}
}

async function getMockLinksTabs(): Promise<ILinksTabsResponse> {
	await delay(1000);

	return {
		ticker_id: 'Crypto-BTC_Bitcoin',
		website: {
			label: 'tesla.com',
			link: 'https://tesla.com',
		},
		socials: [
			{
				logo_url: 'https://financialmodelingprep.com/image-stock/FREJO.png',
				link: 'https://tesla.com',
			},
			{
				logo_url: 'https://financialmodelingprep.com/image-stock/FREJO.png',
				link: 'https://tesla.com',
			},
			{
				logo_url: 'https://financialmodelingprep.com/image-stock/FREJO.png',
				link: 'https://tesla.com',
			},
		],
		tags: ['Bitcoin Ecosystem', 'Layer 1'],
	};
}
