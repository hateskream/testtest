<script setup lang="ts">
import { UiSkeletonGroup } from '@/shared/ui/skeleton';

const props = defineProps<{
	count?: number;
}>();
</script>

<template>
	<div :class="classes.root">
		<ui-skeleton-group :count="props.count" />
	</div>
</template>

<style module="classes">
.root {
	padding: 10px;
}
</style>
