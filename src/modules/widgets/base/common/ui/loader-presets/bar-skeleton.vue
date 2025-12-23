<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.container">
		<div
			v-for="n in 5"
			:key="n"
			:class="classes.barSkeletonRow"
		>
			<ui-skeleton width="104px" height="20px" />
			<div :class="classes.barSkeletonRight">
				<ui-skeleton :width="`${100 / n}px`" height="20px" />
			</div>
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

.barSkeletonRight {
	width: 100px;
}

.barSkeletonRow {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
