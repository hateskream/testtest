<script setup lang="ts">
import { computed, type CSSProperties, reactive, useTemplateRef, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';

const MIN_FADE_SIZE = 6;

export interface IScrollableRow {
	/**
	 * Минимальное преодоленное расстояние (в пикселях) для старта перемещения.
	 * Необходимо для предотвращения перемещения при клике на интерактивный элемент.
	 * Установите в `0` для немедленного перетаскивания.
	 * @default 4
	 */
	dragThreshold?: number;

	/**
	 * Показывать fade-gradient для индикации переполнения.
	 * Автоматически скрывается, если контент не переполняет контейнер.
	 * @default false
	 */
	fade?: boolean;

	/**
	 * Размер fade-gradient в пикселях.
	 * Применим только если `fade` включен.
	 * @default 1;
	 */
	fadeSize?: number;

	/**
	 * Gap scrollable элементов, если их несколько.
	 * @default 6px
	 */
	gap?: CSSProperties['gap'];

	/**
	 * Align-items scrollable контейнера
	 */
	alignItems?: CSSProperties['alignItems'];
}

const props = withDefaults(defineProps<IScrollableRow>(), {
	dragThreshold: 4,
	fadeSize: 24,
	gap: '6px',
	alignItems: 'center',
	fade: true,
});

const finalFadeSize = computed(() => Math.max(props.fadeSize, MIN_FADE_SIZE));

const fadeSizeInPx = computed(() => `${finalFadeSize.value}px`);
const fadePaddingInPx = computed(() => `${finalFadeSize.value * 0.66}px`);

const scrollableRef = useTemplateRef('scrollable');

const state = reactive({
	isDown: false,
	isDragging: false,
	isOverflowing: false,
	startX: 0,
	startScroll: 0,
	pointerId: null as (number | null),
});

// overflow

function checkOverflow() {
	const el = scrollableRef.value;
	if (!el) {
		state.isOverflowing = false;
		return;
	}

	state.isOverflowing = el.scrollWidth > el.clientWidth;
}

useResizeObserver(scrollableRef, checkOverflow);

watch(
	() => state.isOverflowing,
	(val) => {
		if (!val) {
			state.isDown = false;
			state.isDragging = false;
			state.pointerId = null;

			scrollableRef.value?.scrollTo({ left: 0, top: 0 });
		}
	},
);

// scroll handlers

function onPointerDown(e: PointerEvent) {
	if (!scrollableRef.value || !state.isOverflowing) {
		return;
	}

	state.isDown = true;
	state.isDragging = false;
	state.startX = e.clientX;
	state.startScroll = scrollableRef.value.scrollLeft;
	state.pointerId = e.pointerId;
}

function onPointerMove(e: PointerEvent) {
	if (!state.isDown || !scrollableRef.value || !state.isOverflowing) {
		return;
	}

	const dx = e.clientX - state.startX;

	if (!state.isDragging) {
		if (Math.abs(dx) < props.dragThreshold) {
			return;
		}

		state.isDragging = true;
		e.preventDefault();
		e.stopPropagation();
		scrollableRef.value.setPointerCapture(state.pointerId!);
	}

	e.preventDefault();
	e.stopPropagation();

	scrollableRef.value.scrollLeft =
		state.startScroll - dx;
}

function onPointerUp() {
	if (!scrollableRef.value || !state.isOverflowing) {
		return;
	}

	if (state.pointerId !== null) {
		scrollableRef.value.releasePointerCapture(state.pointerId);
	}

	state.isDown = false;
	state.isDragging = false;
	state.pointerId = null;
}
</script>

<template>
	<div :class="[classes.scrollableRow, { [classes.overflowing]: state.isOverflowing, [classes.fade]: props.fade }]">
		<div
			ref="scrollable"
			tabindex="0"
			:class="classes.scrollable"
			@scroll.prevent.stop
			@pointerdown.prevent.stop="onPointerDown"
			@pointermove.prevent.stop="onPointerMove"
			@pointerup.prevent.stop="onPointerUp"
			@lostpointercapture="onPointerUp"
			@pointercancel.prevent.stop
		>
			<slot />
		</div>
	</div>
</template>

<style module="classes">
@layer kit {
	.scrollableRow {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		overflow: hidden;
	}

	.scrollableRow.overflowing.fade::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: v-bind(fadeSizeInPx);
		height: 100%;
		background:
			linear-gradient(
				90deg,
				rgb(0 0 0 / 0%) 0%,
				rgb(0 0 0) 100%
			);
		pointer-events: none;
	}

	.scrollable {
		display: flex;
		align-items: v-bind(alignItems);
		align-self: stretch;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		overflow-x: scroll;
		user-select: none;
		gap: v-bind(gap);
		touch-action: pan-x;
		overscroll-behavior-x: contain;
		scrollbar-width: none;
	}

	.scrollableRow.overflowing.fade .scrollable {
		margin-right: calc(-1 * v-bind(fadePaddingInPx));
		padding-right: v-bind(fadePaddingInPx);
		cursor: grab;
	}

	.scrollableRow.overflowing .scrollable:active {
		cursor: grabbing;
	}

	.scrollable::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
}
</style>
