<script setup lang="ts">
import { computed, type CSSProperties, nextTick, useTemplateRef, watch } from 'vue';

import { MarketType } from '@/modules/market';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { type ITickerItem } from '../../model';
import { useTickerSelectorInfiniteQuery } from '../../composables';
import { UiModalContent } from '@/shared/ui/modal';
import { UiScrollFade } from '@/shared/ui/scroll-fade';

import TickerSelectorEmpty from './ticker-selector-empty.vue';
import TickerSelectorItemsSkeleton from './skeletons/ticker-selector-items-skeleton.vue';
import TickerSelectorError from './error/ticker-selector-error.vue';

interface ITickerSelectorIteratorProps {
	marketType: MarketType;
	searchQuery?: string;
	maxHeight?: CSSProperties['max-height'];
}

const props = withDefaults(defineProps<ITickerSelectorIteratorProps>(), {
	maxHeight: '382px',
	searchQuery: '',
});

const {
	data,
	isLoading,
	isError,
	isFetchingNextPage,
	hasNextPage,
	fetchNextPage,
	refetch,
} = useTickerSelectorInfiniteQuery(() => ({
	search_query: props.searchQuery,
	markets: [props.marketType || MarketType.Forex],
}));

const items = computed<ITickerItem[]>(() => {
	if (!props.marketType) {
		return [];
	}

	return (
		data.value?.pages.flatMap(page =>
			page.categories
				.filter(c => c.market_type === props.marketType)
				.flatMap(c => c.tickers),
		) ?? []
	);
});

const scrollFadeRef = useTemplateRef<{ $el: HTMLElement }>('scrollFade');

const SCROLL_OFFSET = 300;

function hasScroll(el: HTMLElement): boolean {
	return el.scrollHeight > el.clientHeight + SCROLL_OFFSET;
}

async function ensureScrollable() {
	const el = scrollFadeRef.value?.$el;
	if (!el) {
		return;
	}

	while (
		hasNextPage.value &&
		!isFetchingNextPage.value &&
		!hasScroll(el)
	) {
		await fetchNextPage();
		await nextTick();
	}
}

function onScroll(e: Event) {
	const el = e.target as HTMLElement;

	if (!hasNextPage.value || isFetchingNextPage.value) {
		return;
	}

	if (el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_OFFSET) {
		fetchNextPage();
	}
}

watch(isLoading, loaded => {
	if (!loaded) {
		nextTick().then(ensureScrollable);
	}
}, { immediate: true });

watch(() => props.marketType, () => {
	nextTick(() => {
		const scrollElement = scrollFadeRef.value?.$el;
		if (scrollElement) {
			scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
		}
	});
});
</script>

<template>
	<ui-modal-content :style="{ maxHeight: props.maxHeight }">
		<ui-scroll-fade ref="scrollFade" @scroll="onScroll">
			<div :class="classes.list">
				<template v-if="isLoading">
					<ui-skeleton
						v-for="i in 9"
						:key="i"
						animation="wave"
						border-radius="12.4px"
						width="100%"
						height="32px"
					/>
				</template>

				<template v-else-if="isError">
					<ticker-selector-error @retry="refetch" />
				</template>

				<template v-else-if="items.length > 0">
					<slot name="before-tickers" />

					<template
						v-for="ticker in items"
						:key="ticker.canonical_ticker_id"
					>
						<slot :ticker="ticker" />
					</template>

					<ticker-selector-items-skeleton v-if="isFetchingNextPage" />
				</template>

				<ticker-selector-empty v-else>
					Nothing found in {{ props.marketType }}
				</ticker-selector-empty>
			</div>
		</ui-scroll-fade>
	</ui-modal-content>
</template>

<style module="classes">
.list {
	display: flex;
	flex-direction: column;
	gap: var(--padding-s2, 2px);
}
</style>
