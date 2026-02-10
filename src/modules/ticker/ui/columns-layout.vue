<script setup lang="ts">
import { computed, inject, watch, useTemplateRef } from 'vue';
import { useEventListener, useScroll, useBreakpoints } from '@vueuse/core';

import { useTickerContext } from '@/modules/ticker/composables';
import { resolveMarketTypeFromTicker } from '@/modules/cell';
import { MarketType } from '@/modules/market';

interface IProps {
	disableScroll?: boolean;
}

const { disableScroll = false } = defineProps<IProps>();
const { tickerId } = useTickerContext();
const tickerType = computed(() => resolveMarketTypeFromTicker(tickerId.value));
const onBottomReached = inject<((reached: boolean) => void) | null>('onBottomReached', null);
const handleFooterScroll = inject<((delta: number) => boolean) | null>('handleFooterScroll', null);

function isScrollingDown(deltaY: number): boolean {
	return deltaY > 0;
}

function isScrollingUp(deltaY: number): boolean {
	return deltaY < 0;
}

function canFooterHandleScroll(deltaY: number): boolean {
	return handleFooterScroll !== null && handleFooterScroll(deltaY);
}

function preventDefaultScrollBehavior(e: WheelEvent): void {
	e.stopPropagation();
	e.preventDefault();
}

function hasElementReachedBottom(el: HTMLElement): boolean {
	return Math.round(el.scrollTop + el.clientHeight) >= el.scrollHeight;
}

const hideLeftColumnTypes: MarketType[] = [MarketType.Etf];

const shouldHideLeftColumn = computed(() => {
	if (!tickerType.value) {
		return false;
	}
	return hideLeftColumnTypes.includes(tickerType.value!);
});

const breakpoints = useBreakpoints({
	mobile: 520,
	tablet: 656,
	desktop2col: 1132,
	desktop3col: 1332,
});

const isDesktop2Col = breakpoints.greaterOrEqual('desktop2col');
const isDesktop3Col = breakpoints.greaterOrEqual('desktop3col');
const isTablet = breakpoints.greaterOrEqual('tablet');

const layoutMode = computed(() => {
	if (shouldHideLeftColumn.value) {
		if (isDesktop2Col.value) {
			return 'desktop-2col';
		}
		if (isTablet.value) {
			return 'tablet-2col';
		}
		return 'mobile-2col';
	} else {
		if (isDesktop3Col.value) {
			return 'desktop-3col';
		}
		if (isTablet.value) {
			return 'tablet-3col';
		}
		return 'mobile-3col';
	}
});

const isDesktopMode = computed(() =>
	layoutMode.value === 'desktop-3col' || layoutMode.value === 'desktop-2col',
);

const hideScrollbar = computed(() => disableScroll);

const container = useTemplateRef<HTMLElement>('container');
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer');
const leftCol = useTemplateRef<HTMLElement>('leftCol');
const rightCol = useTemplateRef<HTMLElement>('rightCol');

const scrollElement = computed(() => {
	return isDesktopMode.value ? scrollContainer.value : container.value;
});

const { y: scrollY, arrivedState } = useScroll(scrollElement, {
	observe: {
		mutation: true,
	},
});

function isAtBottom(): boolean {
	return arrivedState.bottom;
}

function isAtTop(): boolean {
	return arrivedState.top;
}

function isInMiddleOfContent(): boolean {
	return !isAtTop() && !isAtBottom();
}

function handleBottomReached(isBottom: boolean) {
	if (onBottomReached) {
		onBottomReached(isBottom);
	}
}

function handleScrollChange() {
	if (onBottomReached && scrollElement.value) {
		const el = scrollElement.value;
		const reachedBottom = hasElementReachedBottom(el);
		onBottomReached(reachedBottom);
	}
}

function onContainerScroll(e: WheelEvent) {
	if (isDesktopMode.value) {
		handleDesktopContainerScroll(e);
	} else {
		handleMobileTabletContainerScroll(e);
	}
}

function handleDesktopContainerScroll(e: WheelEvent): void {
	if (isInMiddleOfContent()) {
		preventDefaultScrollBehavior(e);
	}
}

function handleMobileTabletContainerScroll(e: WheelEvent): void {
	if (disableScroll) {
		preventDefaultScrollBehavior(e);
		return;
	}

	const shouldDelegateScrollDown =
		isAtBottom() &&
		isScrollingDown(e.deltaY) &&
		canFooterHandleScroll(e.deltaY);

	if (shouldDelegateScrollDown) {
		preventDefaultScrollBehavior(e);
		return;
	}

	const shouldDelegateScrollUp =
		isScrollingUp(e.deltaY) &&
		canFooterHandleScroll(e.deltaY);

	if (shouldDelegateScrollUp) {
		preventDefaultScrollBehavior(e);
		return;
	}
}

function onColumnScroll(e: WheelEvent) {
	if (!isDesktopMode.value) {
		return;
	}

	if (disableScroll) {
		e.preventDefault();
		return;
	}

	if (tryDelegateScrollToFooter(e)) {
		return;
	}

	if (isAtTop() && isScrollingUp(e.deltaY)) {
		return;
	}

	handleCustomColumnScroll(e);
}

function tryDelegateScrollToFooter(e: WheelEvent): boolean {
	if (isAtBottom() && isScrollingDown(e.deltaY)) {
		if (canFooterHandleScroll(e.deltaY)) {
			preventDefaultScrollBehavior(e);
			return true;
		}
		return false;
	}

	if (isScrollingUp(e.deltaY)) {
		if (canFooterHandleScroll(e.deltaY)) {
			preventDefaultScrollBehavior(e);
			return true;
		}
	}

	return false;
}

function handleCustomColumnScroll(e: WheelEvent): void {
	preventDefaultScrollBehavior(e);

	const el = e.currentTarget as HTMLElement;
	el.scrollTop += e.deltaY;

	syncColumnScrollWithContainer(el, e.deltaY);
}

function syncColumnScrollWithContainer(el: HTMLElement, deltaY: number): void {
	const shouldSyncScrollUp =
		el.scrollTop === 0 &&
		isScrollingUp(deltaY) &&
		!isAtTop();

	if (shouldSyncScrollUp) {
		scrollY.value += deltaY;
		return;
	}

	const shouldSyncScrollDown =
		hasElementReachedBottom(el) &&
		isScrollingDown(deltaY) &&
		!isAtBottom();

	if (shouldSyncScrollDown) {
		scrollY.value += deltaY;
	}
}

watch(() => arrivedState.bottom, handleBottomReached);
watch(scrollY, handleScrollChange);

useEventListener(container, 'wheel', onContainerScroll, { passive: false });

watch(isDesktopMode, (isDesktop) => {
	if (isDesktop) {
		useEventListener(scrollContainer, 'wheel', onColumnScroll, { passive: false });
		useEventListener(leftCol, 'wheel', onColumnScroll, { passive: false });
		useEventListener(rightCol, 'wheel', onColumnScroll, { passive: false });
	}
}, { immediate: true });
</script>

<template>
	<div
		ref="container"
		:class="[
			classes.root,
			classes[layoutMode],
			{
				[classes.scrollableContainer]: !isDesktopMode,
				[classes.hideScrollbar]: hideScrollbar
			}
		]"
	>
		<template v-if="layoutMode === 'desktop-3col'">
			<div
				ref="leftCol"
				:class="[
					classes.leftCol,
					{ [classes.hideScrollbar]: hideScrollbar }
				]"
			>
				<slot name="leftCol"></slot>
			</div>
			<div
				ref="scrollContainer"
				:class="[
					classes.mainCol,
					{ [classes.hideScrollbar]: hideScrollbar }
				]"
			>
				<slot name="mainCol"></slot>
			</div>
			<div
				ref="rightCol"
				:class="[
					classes.rightCol,
					{ [classes.hideScrollbar]: hideScrollbar }
				]"
			>
				<slot name="rightCol"></slot>
			</div>
		</template>

		<template v-else-if="layoutMode === 'tablet-3col'">
			<div :class="classes.topRow">
				<div :class="classes.sideCol">
					<slot name="leftCol"></slot>
				</div>
				<div :class="classes.sideCol">
					<slot name="rightCol"></slot>
				</div>
			</div>
			<div :class="classes.mainColStatic">
				<slot name="mainCol"></slot>
			</div>
		</template>

		<template v-else-if="layoutMode === 'mobile-3col'">
			<div :class="classes.columnStatic">
				<slot name="leftCol"></slot>
			</div>
			<div :class="classes.columnStatic">
				<slot name="rightCol"></slot>
			</div>
			<div :class="classes.columnStatic">
				<slot name="mainCol"></slot>
			</div>
		</template>

		<template v-else-if="layoutMode === 'desktop-2col'">
			<div
				ref="scrollContainer"
				:class="[
					classes.mainCol,
					classes.mainColExpanded,
					{ [classes.hideScrollbar]: hideScrollbar }
				]"
			>
				<slot name="mainCol"></slot>
			</div>
			<div
				ref="rightCol"
				:class="[
					classes.rightCol,
					{ [classes.hideScrollbar]: hideScrollbar }
				]"
			>
				<slot name="rightCol"></slot>
			</div>
		</template>

		<template v-else-if="layoutMode === 'tablet-2col'">
			<div :class="classes.col50Static">
				<slot name="mainCol"></slot>
			</div>
			<div :class="classes.col50Static">
				<slot name="rightCol"></slot>
			</div>
		</template>

		<template v-else-if="layoutMode === 'mobile-2col'">
			<div :class="classes.columnStatic">
				<slot name="mainCol"></slot>
			</div>
			<div :class="classes.columnStatic">
				<slot name="rightCol"></slot>
			</div>
		</template>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	height: calc(100svh);
}

.scrollableContainer {
	overflow-x: hidden;
	overflow-y: auto;
}

.desktop-3col {
	gap: 24px;
	overflow: hidden;
}

.leftCol {
	flex: 0 0 330px;
	width: 330px;
	height: 100%;
	padding-bottom: 10px;
	overflow: hidden;
}

.rightCol {
	flex: 0 0 330px;
	width: 330px;
	height: 100%;
	padding-bottom: 10px;
	overflow-x: hidden;
	overflow-y: auto;
}

.mainCol {
	display: flex;
	flex-grow: 2;
	flex-direction: column;
	height: 100%;
	padding-bottom: 5px;
	overflow-x: hidden;
	overflow-y: auto;
	gap: 40px;
}

.mainColExpanded {
	flex-grow: 3;
}

.tablet-3col {
	flex-direction: column;
	gap: 24px;
	padding-bottom: 10px;
}

.topRow {
	display: flex;
	gap: 24px;
	flex-shrink: 0;
}

.sideCol {
	flex: 1;
	width: 50%;
	padding-bottom: 10px;
}

.mainColStatic {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	gap: 40px;
}

.mobile-3col {
	flex-direction: column;
	gap: 24px;
	padding-bottom: 10px;
}

.columnStatic {
	flex-shrink: 0;
	width: 100%;
}

.desktop-2col {
	gap: 24px;
	overflow: hidden;
}

.tablet-2col {
	gap: 24px;
	padding-bottom: 10px;
}

.col50Static {
	display: flex;
	flex: 1;
	flex-direction: column;
	width: 50%;
	gap: 40px;
}

.mobile-2col {
	flex-direction: column;
	gap: 24px;
	padding-bottom: 10px;
}

.hideScrollbar {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.hideScrollbar::-webkit-scrollbar {
	display: none;
}
</style>
