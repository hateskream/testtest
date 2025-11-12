<script setup lang="ts">
import { BaseLoaderComponent } from '@/modules/widgets/base';
</script>

<template>
	<base-loader-component :row-height="40" :class="classes.container" />
</template>

<style module="classes">
.container {
	padding: 0 20px 12px;
}
</style>
