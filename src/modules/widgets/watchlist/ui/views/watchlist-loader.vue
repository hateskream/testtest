<script setup lang="ts">
import { BaseLoaderComponent } from '@/modules/widgets/base';
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<base-loader-component :row-height="50" :class="classes.preloaderContainer">
		<template #before>
			<div>
				<ui-skeleton width="30%" height="32px" />
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
