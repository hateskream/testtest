<script setup lang="ts">
import PlaceholderComponent from './placeholder-component.vue';
</script>

<template>
	<div :class="classes.root">
		<placeholder-component />
	</div>
</template>

<style module="classes">
.root {
	width: 100%;
	height: 100%;
	padding: 10px;
}
</style>
