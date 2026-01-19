<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.socials">
		<div
			v-for="item in 3"
			:key="item"
		>
			<ui-skeleton
				border-radius="50%"
				height="20px"
				width="20px"
			/>
		</div>
	</div>
</template>

<style module="classes">
.socials {
	display: flex;
	gap: 6px;
}
</style>
