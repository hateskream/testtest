<script setup lang="ts">

</script>

<template>
	<div :class="classes.body">
		<slot></slot>
	</div>
</template>

<style module="classes">
.body {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
}
</style>
