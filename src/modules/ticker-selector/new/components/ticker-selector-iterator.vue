<script setup lang="ts">
import { computed, nextTick, useTemplateRef, watch } from 'vue';

import { MarketType } from '@/modules/market';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { type ITickerItem } from '../../model';
import { useTickerSelectorInfiniteQuery } from '../../composables';
import { UiModalContent } from '@/shared/ui/modal';

import TickerSelectorEmpty from './ticker-selector-empty.vue';
import TickerSelectorItemsSkeleton
	from '@/modules/ticker-selector/new/components/skeletons/ticker-selector-items-skeleton.vue';

const props = defineProps<{
	marketType: MarketType;
	searchQuery?: string;
}>();

const {
	data,
	isLoading,
	isFetchingNextPage,
	hasNextPage,
	fetchNextPage,
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

const wrapperRef = useTemplateRef('wrapper');

const SCROLL_OFFSET = 300;

function hasScroll(el: HTMLElement) {
	return el.scrollHeight > el.clientHeight + SCROLL_OFFSET;
}

async function ensureScrollable() {
	if (!wrapperRef.value) {
		return;
	}

	while (
		hasNextPage.value &&
		!isFetchingNextPage.value &&
		!hasScroll(wrapperRef.value.$el)
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
</script>

<template>
	<ui-modal-content
		ref="wrapper"
		:class="classes.content"
		@scroll.passive="onScroll"
	>
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

		<template v-else-if="items.length > 0">
			<slot name="before-tickers" />

			<template
				v-for="ticker in items"
				:key="ticker.canonical_ticker_id"
			>
				<slot :ticker="ticker" />
			</template>

			<ticker-selector-items-skeleton
				v-if="isFetchingNextPage"
			/>
		</template>

		<ticker-selector-empty v-else>
			Noting found in {{props.marketType}}
		</ticker-selector-empty>
	</ui-modal-content>
</template>

<style module="classes">
.more {
	margin-top: 2px;
	gap: 0;
}

.content {
	max-height: 382px !important;
}


</style>
