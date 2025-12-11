<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';

const props = defineProps<{
	size?: string;
}>();
</script>

<template>
	<ui-skeleton
		:width="props.size || '32px'"
		:height="props.size || '32px'"
		:shape="'rectangle'"
		:animation="'wave'"
		:opacity="0.5"
		border-radius="50%"
	/>
</template>
