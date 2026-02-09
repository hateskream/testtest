<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { TickerBaseTabSection } from '@/modules/ticker/ui/base';
</script>

<template>
	<ticker-base-tab-section>
		<template #title>
			<ui-skeleton width="60px" height="22px" />
		</template>
		<template #content>
			<ui-skeleton
				v-for="key in 5"
				:key="key"
				width="100%"
				height="160px"
				border-radius="var(--radius-radius-s20-72, 28.4px)"
			/>
		</template>
	</ticker-base-tab-section>
</template>

<style module="classes">

</style>
