import { inject, type InjectionKey, provide, type Ref } from 'vue';

export type TickerContext = {
	tickerId: Readonly<Ref<string>>;
	changeTickerId: (tickerId: string) => void;
};

const TickerContextKey: InjectionKey<TickerContext> = Symbol('TickerContext');

export function createTickerContext(context: TickerContext) {
	provide(TickerContextKey, context);

	return context;
}

export function useTickerContext() {
	const context = inject(TickerContextKey);

	if (!context) {
		throw new Error('useTickerContext must be used in ticker layout');
	}

	return context;
}
