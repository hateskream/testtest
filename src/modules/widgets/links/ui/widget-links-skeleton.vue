<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.root">
		<ui-skeleton
			v-for="item in 3"
			:key="item"
			width="100%"
			height="38px"
			border-radius="6px"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	gap: 2px;
	width: 100%;
	padding: 0 var(--padding-padding-s11, 20px);
}
</style>
