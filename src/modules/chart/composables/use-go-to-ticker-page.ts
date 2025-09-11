import { useRouter } from 'vue-router';

import { SymbolType, decodeTickerId } from '@/modules/cell';
import { RouteNames } from '@/types/route.d';

const symbolTypeToPage: Record<SymbolType, RouteNames> = {
	[SymbolType.Index]: RouteNames.TickerIndices,
	[SymbolType.Commodity]: RouteNames.TickerCommodities,
	[SymbolType.Stock]: RouteNames.TickerStock,
	[SymbolType.Crypto]: RouteNames.TickerCrypto,
	[SymbolType.Forex]: RouteNames.TickerForex,
	[SymbolType.PlaneText]: RouteNames.TickerStock,
};

export function useGoToTickerPage() {
	const router = useRouter();

	function goToTickerPage(rawId: string) {
		const { symbolType, tickerId } = decodeTickerId(rawId) || {};

		if (!symbolType || !tickerId) {
			return;
		}

		router.push({
			name: symbolTypeToPage[symbolType],
			params: { id: tickerId },
		});
	}

	return {
		goToTickerPage,
	};
}
