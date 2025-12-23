<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.container">
		<div
			v-for="n in 5"
			:key="n"
			:class="classes.listSkeletonRow"
		>
			<ui-skeleton width="20px" height="20px" />
			<ui-skeleton width="60px" height="20px" />
		</div>
	</div>
</template>

<style module="classes">
.container {
	padding-top:16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.listSkeletonRow {
	display: flex;
	gap: 8px;
	align-items: center;
}
</style>
