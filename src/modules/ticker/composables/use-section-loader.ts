import {
	defineAsyncComponent,
	shallowRef,
	ref,
	watch,
	markRaw,
	type Ref,
	type Component,
} from 'vue';

import { TICKER_SECTION_COMPONENT, type TickerSectionComponent } from '../models';

type AsyncComp = ReturnType<typeof defineAsyncComponent>;

const asyncComponentCache = new Map<TickerSectionComponent, AsyncComp>();

export const useTickerSectionLoader = (
	componentType: Ref<TickerSectionComponent | null>,
) => {
	const component = shallowRef<AsyncComp | null>(null);
	const error = ref<Error | null>(null);
	const isLoading = ref(false);
	const loadAttempts = ref(0);

	const loaders: Record<TickerSectionComponent, () => Promise<Component>> = {
		[TICKER_SECTION_COMPONENT.TEST_SECTION_ONE]: () =>
			import('@/modules/ticker/ui/test-components/sections/test-section-one')
				.then(m => m.TestSectionOne),

		[TICKER_SECTION_COMPONENT.TEST_SECTION_TWO]: () =>
			import('@/modules/ticker/ui/test-components/sections/test-section-two')
				.then(m => m.TestSectionTwo),

		[TICKER_SECTION_COMPONENT.INSIGHTS_SECTION]: () =>
			import('@/modules/ticker/ui/test-components/sections/insights-section/ticker-insights-section.vue'),
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
};
