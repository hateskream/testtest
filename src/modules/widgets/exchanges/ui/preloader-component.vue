<script setup lang="ts">
import { BaseLoaderComponent } from '@/modules/widgets/base';
</script>

<template>
	<base-loader-component
		:row-height="48"
		:class="classes.preloaderContainer"
		:display-variant="'list'"
	/>
</template>

<style module="classes">
.preloaderContainer {
	gap: 8px;
}
</style>
