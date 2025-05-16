<script setup lang="ts">
import { UiSkeletonGroup } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.root">
		<ui-skeleton-group />
	</div>
</template>

<style module="classes">
.root {
	padding: 10px;
}
</style>
