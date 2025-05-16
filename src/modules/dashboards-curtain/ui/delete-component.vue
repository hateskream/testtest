<script setup lang="ts">
import { ref, watch } from 'vue';

import { useСanDelete } from './use-mouse-position';

const emit = defineEmits<{ (e: 'is-in', value: boolean): void }>();
const rootRef = ref<HTMLDivElement | null>(null);

const { canDelete } = useСanDelete(rootRef);

watch(canDelete,
	(newValue) => {
		emit('is-in', newValue);
	},
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
