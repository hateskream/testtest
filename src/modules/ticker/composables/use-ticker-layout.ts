import { inject, type InjectionKey, provide, type Ref } from 'vue';

export type TickerLayoutContext = {
	setBottomReached: (state: boolean) => void;
	handleFooterScroll: (delta: number) => boolean;
	isInReportsMode: Readonly<Ref<boolean>>;
};

const TickerLayoutContextKey: InjectionKey<TickerLayoutContext> = Symbol('TickerLayoutContext');

export function createTickerLayoutContext(context: TickerLayoutContext) {
	provide(TickerLayoutContextKey, context);

	return context;
}

export function useTickerLayout() {
	const context = inject(TickerLayoutContextKey);

	if (!context) {
		throw new Error('useTickerLayout must be used in ticker layout');
	}

	return context;
}
