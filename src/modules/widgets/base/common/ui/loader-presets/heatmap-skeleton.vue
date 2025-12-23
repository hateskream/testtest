<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';

//TODO ЗАТАЩИТЬ КОРРЕКТНЫЙ
</script>

<template>
	<div :class="classes.container">
		<ui-skeleton width="104px" height="20px" />
		<ui-skeleton width="62px" height="20px" />

	</div>
</template>

<style module="classes">
.container {
	padding-top:16px;
	display: flex;
	flex: 1 0 0;
	justify-content: flex-start;
	align-items: flex-start;
	gap: 4px;
}
</style>
