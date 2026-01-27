<script setup lang="ts">
import { computed, inject, watch, useTemplateRef } from 'vue';
import { useEventListener, useScroll, useBreakpoints } from '@vueuse/core';

import { TickerType } from '../models';
import { useTickerContext } from '@/modules/ticker/composables';

interface IProps {
	disableScroll: boolean;
}

const { disableScroll } = defineProps<IProps>();
const { tickerType } = useTickerContext();
const onBottomReached = inject<((reached: boolean) => void) | null>('onBottomReached', null);
const handleFooterScroll = inject<((delta: number) => boolean) | null>('handleFooterScroll', null);

const hideLeftColumnTypes: TickerType[] = [TickerType.ETF];

const shouldHideLeftColumn = computed(() => {
	if (!tickerType) {
		return false;
	}
	return hideLeftColumnTypes.includes(tickerType.value);
});

const breakpoints = useBreakpoints({
	tablet: 640,
	desktop: 1280,
});

const isDesktop = computed(() => breakpoints.greaterOrEqual('desktop'));
const isTablet = computed(() => breakpoints.greaterOrEqual('tablet'));

const showLeftCol = computed(() => !shouldHideLeftColumn.value);

const container = useTemplateRef<HTMLElement>('container');
const leftCol = useTemplateRef<HTMLElement>('leftCol');
const rightCol = useTemplateRef<HTMLElement>('rightCol');
const mainCol = useTemplateRef<HTMLElement>('mainCol');

const { y: scrollMainCol, arrivedState } = useScroll(mainCol, { observe:  {
	mutation: true,
} });

function handleBottomReached(isBottom: boolean) {
	if (onBottomReached) {
		onBottomReached(isBottom);
	}
}

function handleScrollMainCol() {
	if (onBottomReached && mainCol.value) {
		const isAtBottom = Math.abs(
			mainCol.value.scrollHeight - mainCol.value.scrollTop - mainCol.value.clientHeight,
		) < 5;
		onBottomReached(isAtBottom);
	}
}

function onContainerScroll(e: WheelEvent) {
	if (!arrivedState.top && !arrivedState.bottom) {
		e.stopPropagation();
		e.preventDefault();
	}
}

function onColumnScroll(e: WheelEvent) {
	if (disableScroll) {
		e.preventDefault();
		return;
	}

	if (arrivedState.bottom && e.deltaY > 0) {
		if (handleFooterScroll && handleFooterScroll(e.deltaY)) {
			e.stopPropagation();
			e.preventDefault();
			return;
		}
		return;
	}

	if (arrivedState.top && e.deltaY < 0) {
		return;
	}

	if (handleFooterScroll && e.deltaY < 0) {
		if (handleFooterScroll(e.deltaY)) {
			e.stopPropagation();
			e.preventDefault();
			return;
		}
	}

	e.stopPropagation();
	e.preventDefault();
	const el = e.currentTarget as HTMLElement;
	el.scrollTop += e.deltaY;

	if (el.scrollTop === 0 && e.deltaY < 0 && !arrivedState.top) {
		scrollMainCol.value += e.deltaY;
		return;
	}

	const isBottom = Math.round(el.scrollTop + el.clientHeight) >= el.scrollHeight;
	if (isBottom && e.deltaY > 0 && !arrivedState.bottom) {
		scrollMainCol.value += e.deltaY;
	}
}

watch(() => arrivedState.bottom, handleBottomReached);
watch(scrollMainCol, handleScrollMainCol);

useEventListener(container, 'wheel', onContainerScroll, { passive: false });
useEventListener(leftCol, 'wheel', onColumnScroll, { passive: false });
useEventListener(rightCol, 'wheel', onColumnScroll, { passive: false });
useEventListener(mainCol, 'wheel', onColumnScroll, { passive: false });
</script>

<template>
	<div ref="container" :class="classes.root">
		<div
			v-if="showLeftCol"
			ref="leftCol"
			:class="classes.leftCol"
		>
			<slot name="leftCol"></slot>
		</div>
		<div
			ref="mainCol"
			:class="[
				classes.mainCol,
				{ [classes.mainColExpanded]: shouldHideLeftColumn }
			]"
		>
			<slot v-if="!isTablet.value" name="leftCol"></slot>
			<slot v-if="!isDesktop.value" name="rightCol"></slot>
			<slot name="mainCol"></slot>
		</div>
		<div
			v-if="isDesktop.value"
			ref="rightCol"
			:class="classes.rightCol"
		>
			<slot name="rightCol"></slot>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	gap: 24px;
	height: calc(100svh);
}

.leftCol {
	flex: 0 0 330px;
	width: 100%;
	height: 100%;
	padding-bottom: 10px;
	overflow: hidden;
}

.rightCol {
	flex: 0 0 330px;
	width: 100%;
	height: 100%;
	padding-bottom: 10px;
	overflow: scroll;
}

.mainCol {
	display: flex;
	flex-grow: 2;
	flex-direction: column;
	height: 100%;
	padding-bottom: 5px;
	overflow: scroll;
	gap: 40px;
}

.mainColExpanded {
	flex-grow: 3;
}
</style>
