<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { BaseLoaderComponent } from '@/modules/widgets/base';
</script>

<template>
	<base-loader-component :class="classes.preloaderContainer">
		<template #header>
			<div>
				<ui-skeleton width="100px" height="32px" />
			</div>
		</template>
	</base-loader-component>
</template>

<style module="classes">
.preloaderContainer {
	gap: 8px;
}
</style>
