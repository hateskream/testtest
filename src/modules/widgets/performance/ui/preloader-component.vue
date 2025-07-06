<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div class="preloader-container">
		<div class="preloader-header">
			<ui-skeleton width="100px" height="14px" />
			<ui-skeleton width="60px" height="14px" />
		</div>
		<div class="preloader-content">
			<ui-skeleton
				v-for="i in 8"
				:key="i"
				width="100%"
				height="24px"
				:style="{ marginBottom: '8px' }"
			/>
		</div>
	</div>
</template>

<style scoped>
.preloader-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px;
	gap: 16px;
}

.preloader-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.preloader-content {
	flex: 1;
}
</style>
