<script setup lang="ts">
import { useNow } from '@vueuse/core';
import { computed } from 'vue';

interface INextEventTimerProps {
	datetime: string;
}

const props = defineProps<INextEventTimerProps>();

const now = useNow({ interval: 60_000 });
const date = computed(() => new Date(props.datetime));

const dateDiff = computed(() => date.value.getTime() - now.value.getTime());

const relativeTime = computed(() => {
	const diff = Math.abs(dateDiff.value);
	const hours = Math.floor(diff / (1000 * 60 * 60));

	if (hours === 1) {
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		return `1 hour ${minutes} minutes`;
	}

	if (hours < 1) {
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		return `${minutes} minutes`;
	}

	return `${hours} hours`;
});

const relativeTimeLabel = computed(() => {
	if (dateDiff.value < 0) {
		return `${relativeTime.value} ago`;
	}

	return `in ${relativeTime.value}`;
});
</script>

<template>
	<span>{{ relativeTimeLabel }}</span>
</template>
