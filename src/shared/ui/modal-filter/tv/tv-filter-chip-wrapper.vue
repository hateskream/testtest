<script setup lang="ts">

</script>

<template>
	<div :class="classes.wrapper">
		<slot />
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	align-items: center;
	padding: 4px 0;
}
</style>
