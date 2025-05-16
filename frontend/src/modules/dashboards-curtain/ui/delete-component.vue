<script setup lang="ts">
import { ref, watch } from 'vue';

import { useMousePositionSync } from './use-mouse-position';

const emit = defineEmits<{ (e: 'is-in', value: boolean): void }>();

const { mouseAt } = useMousePositionSync();
const rootRef = ref<HTMLDivElement | null>(null);

watch(
	mouseAt,
	({ x, y }) => {
		if (!rootRef.value) {
			return;
		}

		const { left, top, right, bottom	} = rootRef.value.getBoundingClientRect();

		const isIn =
      x > left &&
      x < right &&
      y > top &&
      y < bottom;

		emit('is-in', isIn);
	},
	{ deep: true },
);
</script>

<template>
	<div ref="rootRef" :class="classes.root">
		Delete
	</div>
</template>

<style module="classes">
.root {
	position: relative;
	width: 100px;
	height: 100px;
	border: 1px solid #ff0000;
}
</style>
