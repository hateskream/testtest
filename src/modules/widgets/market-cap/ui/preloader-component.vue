<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { BaseLoaderComponent } from '@/modules/widgets/base';
</script>

<template>
	<base-loader-component :class="classes.preloaderContainer">
		<template #before>
			<div>
				<ui-skeleton width="100px" height="32px" />
			</div>
		</template>
	</base-loader-component>
</template>

<style module="classes">
.preloaderContainer {
	padding: 0 16px 16px;
	gap: 8px;
}
</style>
