<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { BaseLoaderComponent } from '@/modules/widgets/base';
</script>

<template>
	<base-loader-component :row-height="40" :class="classes.preloaderContainer">
		<template #header>
			<div :class="classes.preloaderHeader">
				<ui-skeleton width="30%" height="32px" />
				<ui-skeleton width="80px" height="32px" />
			</div>
		</template>
	</base-loader-component>
</template>

<style module="classes">
.preloaderContainer {
	gap: 16px;
}

.preloaderHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
