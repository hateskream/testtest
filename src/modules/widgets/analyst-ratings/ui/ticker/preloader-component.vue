<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<ui-skeleton
		height="70px"
		border-radius="12px"
		:class="classes.full"
	/>
	<ui-skeleton height="70px" border-radius="12px" />
	<ui-skeleton height="70px" border-radius="12px" />
	<ui-skeleton height="70px" border-radius="12px" />
	<ui-skeleton height="70px" border-radius="12px" />
	<ui-skeleton
		height="50px"
		border-radius="12px"
		:class="classes.full"
	/>
</template>

<style module="classes">
.full {
	grid-column: span 2;
}
</style>
