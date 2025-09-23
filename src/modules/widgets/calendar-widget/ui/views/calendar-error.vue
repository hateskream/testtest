<script setup lang="ts">
import { ErrorNetworkComponent } from '@/modules/widgets/base';
</script>

<template>
	<div :class="classes.root">
		<error-network-component />
	</div>
</template>

<style module="classes">
.root {
	height: 300px;
}
</style>
