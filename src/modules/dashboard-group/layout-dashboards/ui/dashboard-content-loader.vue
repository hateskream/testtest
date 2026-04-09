<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.content">
		<ui-skeleton
			border-radius="24px"
			width="100%"
			height="100%"
		/>
	</div>
</template>

<style module="classes">
.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding: 8px 18px;
}
</style>
