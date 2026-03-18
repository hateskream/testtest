<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.view">
		<ui-skeleton height="240px" width="240px" />
	</div>
</template>

<style module="classes">
.view {
	display: flex;
	justify-content: center;
	width: 100%;
	padding: 30px 40px 40px;
}
</style>
