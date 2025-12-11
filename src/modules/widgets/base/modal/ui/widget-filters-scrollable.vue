<script setup lang="ts">
import { ModalBadgeClear } from '@/modules/widgets/base';

withDefaults(defineProps<{
	hideClear?: boolean;
	dragThreshold?: number;
}>(), {
	hideClear: false,
	dragThreshold: 4,
});

const emits = defineEmits<{
	onClearClick: [];
}>();

// const scrollableRef = useTemplateRef('scrollable');
//
// const state = reactive({
// 	isDown: false,
// 	isDragging: false,
// 	startX: 0,
// 	startScroll: 0,
// 	pointerId: null as (number | null),
// });
//
// function onPointerDown(e: PointerEvent) {
// 	if (!scrollableRef.value) {
// 		return;
// 	}
//
// 	state.isDown = true;
// 	state.isDragging = false;
// 	state.startX = e.clientX;
// 	state.startScroll = scrollableRef.value.scrollLeft;
// 	state.pointerId = e.pointerId;
// }
//
// function onPointerMove(e: PointerEvent) {
// 	if (!state.isDown || !scrollableRef.value) {
// 		return;
// 	}
//
// 	const dx = e.clientX - state.startX;
//
// 	if (!state.isDragging) {
// 		if (Math.abs(dx) < props.dragThreshold) {
// 			return;
// 		}
//
// 		state.isDragging = true;
// 		e.preventDefault();
// 		e.stopPropagation();
// 		scrollableRef.value.setPointerCapture(state.pointerId!);
// 	}
//
// 	e.preventDefault();
// 	e.stopPropagation();
//
// 	scrollableRef.value.scrollLeft =
// 		state.startScroll - dx;
// }
//
// function onPointerUp() {
// 	if (!scrollableRef.value) {
// 		return;
// 	}
//
// 	if (state.pointerId !== null) {
// 		scrollableRef.value.releasePointerCapture(state.pointerId);
// 	}
//
// 	state.isDown = false;
// 	state.isDragging = false;
// 	state.pointerId = null;
// }
</script>

<template>
	<div :class="classes.filtersContainer">
		<div
			ref="scrollable"
			:class="classes.filters"
			@scroll.prevent.stop
			@pointerdown.prevent.stop
			@pointermove.prevent.stop
			@pointerup.prevent.stop
			@pointercancel.prevent.stop
		>
			<slot />

			<slot name="clear">
				<modal-badge-clear
					v-if="!hideClear"
					:class="classes.clear"
					@click="emits('onClearClick')"
				/>
			</slot>
		</div>
	</div>
</template>

<style module="classes">
.filters {
	display: flex;
	align-items: center;
	align-self: stretch;
	width: 100%;
	height: 100%;
	padding-right: 18px;
	overflow-x: scroll;
	cursor: grab;
	user-select: none;
	gap: 3px;
	touch-action: pan-x;
	overscroll-behavior-x: contain;
}

.filters:active {
	cursor: grabbing;
}

.filtersContainer {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.filtersContainer::after {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	width: 24px;
	height: 100%;
	background:
		linear-gradient(
			90deg,
			rgb(0 0 0 / 0%) 0%,
			rgb(19 19 19) 100%
		);
	pointer-events: none;
}

.clear {
	opacity: 0;
	transition: opacity 0.2s ease-in-out;
}

.filtersContainer:hover .clear {
	opacity: 1;
}
</style>
