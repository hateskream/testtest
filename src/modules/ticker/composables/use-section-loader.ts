import { type Component, defineAsyncComponent, markRaw, type Ref, ref, shallowRef, watch } from 'vue';

import { TICKER_SECTION_COMPONENT, type TickerSectionComponent } from '../models';

type AsyncComp = ReturnType<typeof defineAsyncComponent>;

const asyncComponentCache = new Map<TickerSectionComponent, AsyncComp>();

export function useTickerSectionLoader(componentType: Ref<TickerSectionComponent | null>) {
	const component = shallowRef<AsyncComp | null>(null);
	const error = ref<Error | null>(null);
	const isLoading = ref(false);
	const loadAttempts = ref(0);

	const loaders: Record<TickerSectionComponent, () => Promise<Component>> = {
		// forex
		[TICKER_SECTION_COMPONENT.FOREX_OVERVIEW]: () =>
			import('@/modules/ticker/ui/sections/forex').then(m => m.OverviewSection),
		[TICKER_SECTION_COMPONENT.US_MACROECONOMIC_INDICATORS]: () =>
			import('@/modules/ticker/ui/sections/forex').then(m => m.UsMacroeconomicIndicators),
		[TICKER_SECTION_COMPONENT.FOREX_INSIGHTS_AND_ACTIVITY]: () =>
			import('@/modules/ticker/ui/sections/forex').then(m => m.InsightsAndActivity),

		// stock
		[TICKER_SECTION_COMPONENT.STOCK_OVERVIEW]: () =>
			import('@/modules/ticker/ui/sections/stock').then(m => m.OverviewSection),
		[TICKER_SECTION_COMPONENT.STOCK_VALUATION_AND_ESTIMATES]: () =>
			import('@/modules/ticker/ui/sections/stock').then(m => m.ValuationAndEstimates),
		[TICKER_SECTION_COMPONENT.STOCK_INSIGHTS_AND_ACTIVITY]: () =>
			import('@/modules/ticker/ui/sections/stock').then(m => m.InsightsAndActivity),

		// crypto
		[TICKER_SECTION_COMPONENT.CRYPTO_OVERVIEW]: () =>
			import('@/modules/ticker/ui/sections/crypto').then(m => m.OverviewSection),
		[TICKER_SECTION_COMPONENT.CRYPTO_INSIGHTS_AND_ACTIVITY]: () =>
			import('@/modules/ticker/ui/sections/crypto').then(m => m.InsightsAndActivity),

		// etf
		[TICKER_SECTION_COMPONENT.ETF_OVERVIEW]: () =>
			import('@/modules/ticker/ui/sections/etf').then(m => m.OverviewSection),
		[TICKER_SECTION_COMPONENT.ETF_INSIGHTS_AND_ACTIVITY]: () =>
			import('@/modules/ticker/ui/sections/etf').then(m => m.InsightsAndActivity),
		[TICKER_SECTION_COMPONENT.ETF_HOLDING_SUMMARY]: () =>
			import('@/modules/ticker/ui/sections/etf').then(m => m.HoldingSummary),
		[TICKER_SECTION_COMPONENT.ETF_VALUATION_AND_ESTIMATES]: () =>
			import('@/modules/ticker/ui/sections/etf').then(m => m.ValuationAndEstimates),

		// index
		[TICKER_SECTION_COMPONENT.INDEX_OVERVIEW]: () =>
			import('@/modules/ticker/ui/sections/indices').then(m => m.OverviewSection),
		[TICKER_SECTION_COMPONENT.INDEX_INSIGHTS_AND_ACTIVITY]: () =>
			import('@/modules/ticker/ui/sections/indices').then(m => m.InsightsAndActivity),
		[TICKER_SECTION_COMPONENT.INDEX_HOLDING_SUMMARY]: () =>
			import('@/modules/ticker/ui/sections/indices').then(m => m.HoldingSummary),

		// commodity
		[TICKER_SECTION_COMPONENT.COMMODITY_OVERVIEW]: () =>
			import('@/modules/ticker/ui/sections/commodity').then(m => m.OverviewSection),
		[TICKER_SECTION_COMPONENT.COMMODITY_INSIGHTS_AND_ACTIVITY]: () =>
			import('@/modules/ticker/ui/sections/commodity').then(m => m.InsightsAndActivity),
	};

	const loadComponent = (type: TickerSectionComponent) => {
		const cached = asyncComponentCache.get(type);
		if (cached) {
			component.value = cached;
			return;
		}

		const loader = loaders[type];
		if (!loader) {
			error.value = new Error(`No loader for ${type}`);
			return;
		}

		loadAttempts.value = 0;
		error.value = null;

		const asyncComponent = defineAsyncComponent({
			loader: async () => {
				isLoading.value = true;
				try {
					const loaded = await loader();
					isLoading.value = false;
					return loaded;
				} catch (e) {
					isLoading.value = false;
					error.value = e as Error;
					throw e;
				}
			},

			delay: 200,
			timeout: 10_000,

			onError(err, retry, fail, attempts) {
				error.value = err;

				if (
					attempts < 3 &&
					/fetch|network|Failed to fetch/i.test(err.message)
				) {
					loadAttempts.value = attempts;
					setTimeout(retry, 1000);
				} else {
					fail();
				}
			},
		});

		const raw = markRaw(asyncComponent);
		asyncComponentCache.set(type, raw);
		component.value = raw;
	};

	const retry = async () => {
		if (!componentType.value) {
			return;
		}
		asyncComponentCache.delete(componentType.value);
		component.value = null;
		error.value = null;

		loadComponent(componentType.value);
	};

	const reset = () => {
		component.value = null;
		error.value = null;
		isLoading.value = false;
		loadAttempts.value = 0;
	};

	watch(
		componentType,
		(type) => {
			reset();
			if (type) {
				loadComponent(type);
			}
		},
		{ immediate: true },
	);

	return {
		component,
		error,
		isLoading,
		loadAttempts,
		retry,
		reset,
	};
}
