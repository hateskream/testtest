import { inject, provide, type MaybeRefOrGetter } from 'vue';

const TICKER_ICON_CONTEXT_KEY = Symbol('TICKER_ICON');

export interface IUseTickerIconContext {
	iconSrc?: MaybeRefOrGetter<string>;
}

export function useProvideTickerIconContext(context: IUseTickerIconContext) {
	provide(TICKER_ICON_CONTEXT_KEY, context);
}

export function useTickerIconContext() {
	return inject<IUseTickerIconContext>(TICKER_ICON_CONTEXT_KEY, {});
}
