<script setup lang="ts">
import { BaseDashboardComponent } from '../../base/index.ts';
</script>

<template>
	<base-dashboard-component :class="classes.root">
		<template #title> Price </template>
	</base-dashboard-component>
</template>

<style module="classes">
.root {
	flex-grow: 1.8;
	flex-basis: 0;
}
</style>
