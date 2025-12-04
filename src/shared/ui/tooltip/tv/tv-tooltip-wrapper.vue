<script setup lang="ts">

</script>

<template>
	<div :class="classes.tooltip">
		<slot />
	</div>
</template>

<style module="classes">
.tooltip {
	padding: 4px 10px;
	color: #ffffff;
	background: rgb(22 22 24 / 100%);
	border: 1px solid rgb(199 199 199 / 10%);
	border-radius: 8px;
	opacity: 1;
	transition: all 0.1s ease;
	pointer-events: none;
}
</style>
