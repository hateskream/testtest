<script setup lang="ts">
import { ErrorNetworkComponent } from '@/modules/dashboards-view/dashboards/base';
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
