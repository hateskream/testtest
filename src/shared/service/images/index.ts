import { useLogger } from '@/shared/service/monitoring';

export interface IImageBlacklistConfig {
	exactMatches?: string[];
	startsWith?: string[];
	endsWith?: string[];
	contains?: string[];
	regexPatterns?: RegExp[];
}

export const IMAGE_BLACKLIST_CONFIG: IImageBlacklistConfig = {
	exactMatches: [
		'DCUSD',
		'RTYUSD',
		'ZLUSX',
		'LEUSX',
	],

	startsWith: [
		'%',
	],

	endsWith: [
		'.AX',
		'USD',
	],

	contains: [],

	regexPatterns: [],
};

export function isTickerBlacklisted(
	ticker: string,
	config: IImageBlacklistConfig = IMAGE_BLACKLIST_CONFIG,
): boolean {
	if (!ticker) {
		return false;
	}

	const upperTicker = ticker.trim().toUpperCase();

	if (config.exactMatches?.some(match => upperTicker === match.toUpperCase())) {
		return true;
	}

	if (config.startsWith?.some(prefix => upperTicker.startsWith(prefix.toUpperCase()))) {
		return true;
	}

	if (config.endsWith?.some(suffix => upperTicker.endsWith(suffix.toUpperCase()))) {
		return true;
	}

	if (config.contains?.some(substring => upperTicker.includes(substring.toUpperCase()))) {
		return true;
	}

	if (config.regexPatterns?.some(pattern => pattern.test(ticker))) {
		return true;
	}

	return false;
}

export function extractTickerFromImageUrl(src: string): string | null {
	if (!src) {
		return null;
	}

	try {
		const patterns = [
			/\/image-stock\/([^/]+)\.png/i,
			/\/symbol\/([^/]+)\.png/i,
			/ticker[=/]([^&/]+)/i,
		];

		for (const pattern of patterns) {
			const match = src.match(pattern);
			if (match && match[1]) {
				return decodeURIComponent(match[1]);
			}
		}

		return null;
	} catch (error) {
		const logger = useLogger();
		logger.error(
			'Error extracting ticker from URL',
			{ error: error as Error, context: { tickerSrc: src } },
		);
		return null;
	}
}

export function shouldBlockImageUrl(
	src: string,
	config: IImageBlacklistConfig = IMAGE_BLACKLIST_CONFIG,
): boolean {
	const ticker = extractTickerFromImageUrl(src);

	if (!ticker) {
		return false;
	}

	return isTickerBlacklisted(ticker, config);
}
