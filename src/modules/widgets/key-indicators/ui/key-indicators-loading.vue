<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<key-indicators-wrapper>
		<template #indicators>
			<ui-skeleton
				v-for="item in 4"
				:key="item"
				height="22px"
				width="100%"
				border-radius="2px"
			/>
		</template>

		<template #summarized>
			<ui-skeleton
				width="108px"
				height="20px"
				border-radius="2px"
			/>
		</template>
	</key-indicators-wrapper>
</template>

<style module="classes">
</style>
