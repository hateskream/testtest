<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';

const props = withDefaults(defineProps<{
	count?: number;
}>(), {
	count: 3,
});
</script>

<template>
	<div :class="classes.skeletons">
		<ui-skeleton
			v-for="i in props.count"
			:key="i"
			display="block"
			animation="wave"
			border-radius="12.4px"
			width="100%"
			height="32px"
		/>
	</div>
</template>

<style module="classes">
.skeletons {
	display: flex;
	flex-direction: column;
	gap: 2px;
}
</style>
