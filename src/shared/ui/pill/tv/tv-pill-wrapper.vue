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
	gap: 6px;
	align-items: center;
	margin: 6px 0;
	padding: 0 12px;
}
</style>
