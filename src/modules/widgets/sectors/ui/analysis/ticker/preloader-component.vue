<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.view">
		<ui-skeleton height="100%" width="100%" />
	</div>
</template>

<style module="classes">
.view {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	width: 100%;
	height: 100%;
	min-height: 80px;
	padding: var(--padding-s7, 12px) var(--padding-s11, 20px) var(--padding-s14, 32px) var(--padding-s11, 20px);
}
</style>
