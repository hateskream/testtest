<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';
import { useEventListener, useScroll, useBreakpoints } from '@vueuse/core';

const props = defineProps<{ disableScroll?: boolean }>();
const { disableScroll } = toRefs(props);
const breakpoints = useBreakpoints({
	tablet: 640,
	desktop: 1280,
});

const isDesktop = computed(() => breakpoints.greaterOrEqual('desktop'));
const isTablet = computed(() => breakpoints.greaterOrEqual('tablet'));

const container = ref<HTMLElement>();
const leftCol = ref<HTMLElement>();
const rightCol = ref<HTMLElement>();
const mainCol = ref<HTMLElement>();

const { y: scrollMainCol, arrivedState } = useScroll(mainCol);
const onContainerScroll = (e: WheelEvent) => {
	if (!arrivedState.top && !arrivedState.bottom) {
		e.stopPropagation();
		e.preventDefault();
	}
};
const onColumnScroll = (e: WheelEvent) => {
	if (disableScroll.value) {
		e.preventDefault();
		return;
	}
	if (arrivedState.top && e.deltaY < 0 || arrivedState.bottom && e.deltaY > 0) {
		return;
	}
	e.stopPropagation();
	e.preventDefault();
	const el = e.currentTarget as HTMLElement;
	el.scrollTop += e.deltaY;
	if (el.scrollTop === 0 && e.deltaY<0 && !arrivedState.top) {
		scrollMainCol.value+=e.deltaY;
		return;
	}
	const isBottom = Math.round(el.scrollTop + el.clientHeight) >= el.scrollHeight;
	if (isBottom && e.deltaY>0 && !arrivedState.bottom) {
		scrollMainCol.value+=e.deltaY;
	}
};
useEventListener(container, 'wheel', onContainerScroll, { passive: false });
useEventListener(leftCol, 'wheel', onColumnScroll, { passive: false });
useEventListener(rightCol, 'wheel', onColumnScroll, { passive: false });
useEventListener(mainCol, 'wheel', onColumnScroll, { passive: false });
</script>

<template>
	<div ref="container" :class="classes.root">
		<div
			v-if="isTablet.value"
			ref="leftCol"
			:class="classes.leftCol"
		>
			<slot name="leftCol"></slot>
		</div>
		<div ref="mainCol" :class="classes.mainCol">
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
	height: 100vh;
}

.leftCol,
.rightCol {
	flex: 0 0 330px;
	width: 100%;
	height: 100%;
	overflow: scroll;
}

.mainCol {
	flex-grow: 2;
	height: 100%;
	overflow: scroll;
}
</style>

