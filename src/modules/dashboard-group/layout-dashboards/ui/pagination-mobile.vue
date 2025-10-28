<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IPaginationMobileProps {
	currentIndex: number;
	totalSlides: number;
	canPrev: boolean;
	canNext: boolean;
}

const props = defineProps<IPaginationMobileProps>();

const emits = defineEmits<{
	(e: 'goTo', index: number): void;
	(e: 'prev'): void;
	(e: 'next'): void;
}>();

const VISIBLE_DOTS = 5;

const visibleIndices = computed(() => {
	const indices: number[] = [];
	const halfVisible = Math.floor(VISIBLE_DOTS / 2);

	let start = Math.max(0, props.currentIndex - halfVisible);
	let end = start + VISIBLE_DOTS - 1;

	if (end >= props.totalSlides) {
		end = props.totalSlides - 1;
		start = Math.max(0, end - VISIBLE_DOTS + 1);
	}

	// eslint-disable-next-line no-plusplus
	for (let i = start; i <= end; i++) {
		indices.push(i);
	}

	return indices;
});

function getOpacity(index: number) {
	const delta = index - props.currentIndex;

	return 1 -( Math.abs(delta) * 1.5 / 10);
}
</script>

<template>
	<div :class="classes.root">
		<button
			:disabled="!props.canPrev"
			:class="classes.control"
			@click="emits('prev')"
		>
			<ui-icon :id="IconIds.Prev" />
		</button>
		<div :class="classes.pagination">
			<div
				v-for="index in visibleIndices"
				:key="index"
				:class="[classes.dot, { [classes.active]: index === currentIndex }]"
				:style="{ opacity: getOpacity(index) }"
				@click="emits('goTo', index)"
			/>
		</div>
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
</template>

<style module="classes">
.root {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 30px;
	padding: 0 20px;
}

.pagination {
	display: flex;
	gap: 10px;
}

.dot {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 3px;
	height: 3px;
	background-color: #ffffff;
	border-radius: 50%;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.control {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	color: rgb(255 255 255 / 100%);
	cursor: pointer;
}

.control:disabled {
	color: rgb(255 255 255 / 50%);
	cursor: not-allowed;
	opacity: 0.7;
	backdrop-filter: blur(4px);
}
</style>
