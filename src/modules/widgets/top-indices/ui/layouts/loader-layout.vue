<script setup lang="ts">
import { BaseLoaderComponent } from '@/modules/widgets/base';
</script>

<template>
	<base-loader-component :row-height="48" :class="classes.preloaderContainer" />
</template>

<style module="classes">
.preloaderContainer {
	padding: 0 16px 16px;
}
</style>
