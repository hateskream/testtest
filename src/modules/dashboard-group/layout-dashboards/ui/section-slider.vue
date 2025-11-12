<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { ISection } from '../model';

import SectionComponent from './section-component.vue';

interface ISectionSliderProps {
	slides: ISection[];
	trackStyle: {
		transform: string;
		gap: string;
	};
	canPrev: boolean;
	canNext: boolean;
}

const props = defineProps<ISectionSliderProps>();

const emits = defineEmits<{
	(e: 'pointerDown', event: PointerEvent): void;
	(e: 'pointerMove', event: PointerEvent): void;
	(e: 'pointerUp'): void;
	(e: 'touchStart', event: TouchEvent): void;
	(e: 'touchMove', event: TouchEvent): void;
	(e: 'touchEnd'): void;
	(e: 'wheel', event: WheelEvent): void;
	(e: 'next'): void;
	(e: 'prev'): void;
	(e: 'goTo', index: number): void;
}>();

const containerRef = useTemplateRef<HTMLDivElement>('container');

const sectionHeight = computed(() => {
	if (containerRef.value) {
		return containerRef.value.clientHeight - 14;
	}
	return 0;
});
</script>

<template>
	<div
		ref="container"
		:class="classes.viewport"
		@wheel="emits('wheel', $event)"
		@pointerdown="emits('pointerDown', $event)"
		@pointermove="emits('pointerMove', $event)"
		@pointerup="emits('pointerUp')"
		@pointercancel="emits('pointerUp')"
		@pointerleave="emits('pointerUp')"
		@touchstart="emits('touchStart', $event)"
		@touchmove="emits('touchMove', $event)"
		@touchend="emits('touchEnd')"
	>
		<div
			:class="classes.track"
			:style="props.trackStyle"
		>
			<template
				v-for="(s, i) in props.slides"
				:key="s.id"
			>
				<section-component
					:section="s"
					:parent-height="sectionHeight"
				/>
				<div
					v-if="i < props.slides.length - 1"
					:class="classes.sizer"
				/>
			</template>
		</div>
		<div :class="classes.panel">
			<div :class="classes.content">
				<button
					:disabled="!props.canPrev"
					:class="classes.control"
					@click="emits('prev')"
				>
					<ui-icon :id="IconIds.Prev" />
				</button>
				<button
					:disabled="!props.canNext"
					:class="classes.control"
					@click="emits('next')"
				>
					<ui-icon
						:id="IconIds.Prev"
						:style="{
							transform: `rotate(180deg)`
						}"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.viewport {
	position: relative;
	display: flex;
	flex-grow: 1;
	padding-right: 44px;
	overflow: hidden;
}

.track {
	display: flex;
	flex-grow: 1;
	align-items: stretch;
	padding-right: 10px;
	padding-left: 10px;
	transition: transform 300ms cubic-bezier(0.22, 0.9, 0.2, 1);
	will-change: transform;
}

.panel {
	position: absolute;
	right: 0;
	width: 60px;
	height: 100%;
	padding-left: 16px;
	background: linear-gradient(90deg, rgb(0 0 0 / 0%) 0%, #000000 70%);
}

.content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 10px;
	gap: 8px;
}

.control {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	color: rgb(255 255 255 / 50%);
	background: rgb(73 73 80 / 32%);
	border-radius: 8px;
	backdrop-filter: blur(4px);
	cursor: pointer;
}

.control:disabled {
	color: rgb(255 255 255 / 50%);
	background: rgb(73 73 80 / 32%);
	border-radius: 8px;
	cursor: not-allowed;
	opacity: 0.7;
	backdrop-filter: blur(4px);
}

.control:hover {
	color: rgb(255 255 255 / 100%);
	background: rgb(73 73 80 / 32%);
	border-radius: 8px;
	backdrop-filter: blur(4px);
}

.sizer {
	width: 3px;
	height: 32px;
	margin: auto;
	background: #d9d9d9;
	border-radius: 4px;
	cursor: grab;
	opacity: 0.3;
}

@media (max-width: 768px) {
	.panel {
		display: none;
	}
}
</style>
