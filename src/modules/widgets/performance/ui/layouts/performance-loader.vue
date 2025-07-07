<script setup lang="ts">
import { UiSkeletonGroup, UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.preloaderContainer">
		<div :class="classes.preloaderHeader">
			<ui-skeleton width="30%" height="24px" />
			<ui-skeleton width="60px" height="24px" />
		</div>
		<div :class="classes.preloaderContent">
			<ui-skeleton-group :count="8" height="40px" />
		</div>
	</div>
</template>

<style module="classes">
.preloaderContainer {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px;
	gap: 16px;
}

.preloaderHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.preloaderContent {
	flex: 1;
}
</style>
