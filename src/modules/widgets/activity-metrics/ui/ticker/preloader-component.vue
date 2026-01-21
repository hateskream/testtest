<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { BaseMetrics } from './metrics';
</script>

<template>
	<base-metrics>
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
	</base-metrics>
</template>

<style module="classes">
.full {
	grid-column: span 2;
}
</style>
