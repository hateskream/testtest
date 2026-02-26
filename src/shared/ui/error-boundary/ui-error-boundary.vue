<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

const emit = defineEmits<{
	error: [error: Error];
	retry: [];
}>();

const hasError = ref(false);

onErrorCaptured((error) => {
	emit('error', error);
	hasError.value = true;
	return false;
});

function retry() {
	emit('retry');
	hasError.value = false;
}
</script>

<template>
	<slot v-if="!hasError" />
	<slot
		v-else
		name="fallback"
		:retry="retry"
	/>
</template>
