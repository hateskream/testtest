<script setup lang="ts">
import { BaseLoaderComponent } from '@/modules/widgets/base';
</script>

<template>
	<base-loader-component
		:class="classes.loaderLayout"
	/>
</template>

<style module="classes">
.loaderLayout {
	padding: 0 16px 16px;
}
</style>
