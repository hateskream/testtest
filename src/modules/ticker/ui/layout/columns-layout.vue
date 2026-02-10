<script setup lang="ts">
import { computed, inject, useTemplateRef, watch } from 'vue';
import { notNullish, useBreakpoints, useEventListener, useScroll } from '@vueuse/core';

interface IProps {
	disableScroll?: boolean;
}

const { disableScroll = false } = defineProps<IProps>();

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

const breakpoints = useBreakpoints({
	tablet: 520,
	desktop2col: 656,
	desktop3col: 1132,
});

const isTablet = breakpoints.greaterOrEqual('tablet');
const isDesktopWith3Col = breakpoints.greaterOrEqual('desktop3col');

const layoutMode = computed(() => {
	if (isDesktopWith3Col.value) {
		return 'desktop';
	}

	if (isTablet.value) {
		return 'tablet';
	}

	return 'mobile';
});

const container = useTemplateRef<HTMLElement>('container');
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer');
const leftCol = useTemplateRef<HTMLElement>('leftCol');
const rightCol = useTemplateRef<HTMLElement>('rightCol');

const hasMainColumn = computed(() => notNullish(scrollContainer.value));

const scrollElement = computed(() => {
	if (isDesktopWith3Col.value && hasMainColumn.value) {
		return scrollContainer.value;
	}

	return container.value;
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
	if (isDesktopWith3Col.value) {
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
	if (!isDesktopWith3Col.value) {
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
		isScrollingDown(deltaY);

	if (shouldSyncScrollDown) {
		if (isAtBottom()) {
			handleBottomReached(true);
		} else {
			scrollY.value += deltaY;
		}
	}
}

watch(() => arrivedState.bottom, handleBottomReached, { immediate: true });
watch(scrollY, handleScrollChange);

useEventListener(container, 'wheel', onContainerScroll, { passive: false });

watch(isDesktopWith3Col, (isDesktop) => {
	if (isDesktop ) {
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
			classes.hideScrollbar,
			classes[layoutMode],
			{
				[classes.scrollableContainer]: !isDesktopWith3Col
			}
		]"
	>
		<template v-if="isDesktopWith3Col">
			<div
				ref="leftCol"
				:class="[classes.leftCol, classes.hideScrollbar, { [classes.full]: !hasMainColumn }]"
			>
				<slot name="leftCol"></slot>
			</div>
			<div
				v-if="$slots.mainCol"
				ref="scrollContainer"
				:class="[classes.mainCol, classes.hideScrollbar]"
			>
				<slot name="mainCol"></slot>
			</div>
			<div
				ref="rightCol"
				:class="[classes.rightCol, classes.hideScrollbar]"
			>
				<slot name="rightCol"></slot>
			</div>
		</template>

		<template v-else-if="isTablet">
			<div :class="classes.topRow">
				<div :class="[classes.sideCol, classes.hideScrollbar]">
					<slot name="leftCol"></slot>
				</div>
				<div :class="[classes.sideCol, classes.hideScrollbar]">
					<slot name="rightCol"></slot>
				</div>
			</div>
			<div v-if="$slots.mainCol" :class="[classes.mainColStatic, classes.hideScrollbar]">
				<slot name="mainCol"></slot>
			</div>
		</template>

		<template v-else>
			<div :class="[classes.columnStatic, classes.hideScrollbar]">
				<slot name="leftCol"></slot>
			</div>
			<div :class="[classes.columnStatic, classes.hideScrollbar]">
				<slot name="rightCol"></slot>
			</div>
			<div v-if="$slots.mainCol" :class="[classes.columnStatic, classes.hideScrollbar]">
				<slot name="mainCol"></slot>
			</div>
		</template>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	height: 100svh;
}

.scrollableContainer {
	overflow-x: hidden;
	overflow-y: auto;
}

.desktop {
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

.full.full {
	flex-grow: 1;
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

.tablet {
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

.mobile {
	flex-direction: column;
	gap: 24px;
	padding-bottom: 10px;
}

.columnStatic {
	flex-shrink: 0;
	width: 100%;
}

.hideScrollbar {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.hideScrollbar::-webkit-scrollbar {
	display: none;
}
</style>
