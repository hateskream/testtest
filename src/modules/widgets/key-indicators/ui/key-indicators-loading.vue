<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.indicators">
			<ui-skeleton
				v-for="item in 4"
				:key="item"
				height="22px"
				width="100%"
				border-radius="2px"
			/>
		</div>

		<span :class="classes.summarized">
			<ui-skeleton
				width="100%"
				height="20px"
				border-radius="2px"
			/>
		</span>
	</div>
</template>

<style module="classes">
.container {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 8px 20px;
}

.indicators {
	display: flex;
	flex-direction: column;
	gap: 4px;
}
</style>
