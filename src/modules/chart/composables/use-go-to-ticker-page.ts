import { useRouter } from 'vue-router';

import { decodeTickerId, SymbolType } from '@/modules/cell';
import { RouteNames, RoutePaths } from '@/types/route.d';

interface ISymbolPage {
	name: RouteNames;
	path: RoutePaths;
}

const symbolTypeToPage: Record<SymbolType, ISymbolPage> = {
	[SymbolType.Index]: {
		name: RouteNames.TickerIndices,
		path: RoutePaths.TickerIndices,
	},
	[SymbolType.Commodity]: {
		name: RouteNames.TickerCommodities,
		path: RoutePaths.TickerCommodities,
	},
	[SymbolType.Stock]: {
		name: RouteNames.TickerStock,
		path: RoutePaths.TickerStock,
	},
	[SymbolType.Crypto]: {
		name: RouteNames.TickerCrypto,
		path: RoutePaths.TickerCrypto,
	},
	[SymbolType.Forex]: {
		name: RouteNames.TickerForex,
		path: RoutePaths.TickerForex,
	},
	[SymbolType.Etf]: {
		name: RouteNames.TickerETF,
		path: RoutePaths.TickerETF,
	},
	[SymbolType.PlaneText]: {
		name: RouteNames.TickerStock,
		path: RoutePaths.TickerStock,
	},
};


export function useGoToTickerPage() {
	const router = useRouter();

	function goToTickerPageLink(rawId: string) {
		const { symbolType, tickerId } = decodeTickerId(rawId) || {};

		if (!symbolType || !tickerId) {
			return '';
		}

		return `/ticker/${symbolTypeToPage[symbolType].path}/${tickerId}`;
	}

	function goToTickerPage(rawId: string) {
		const { symbolType, tickerId } = decodeTickerId(rawId) || {};

		if (!symbolType || !tickerId) {
			return;
		}

		router.push({
			name: symbolTypeToPage[symbolType].name,
			params: { id: tickerId },
		});
	}

	return {
		goToTickerPageLink,
		goToTickerPage,
	};
}
