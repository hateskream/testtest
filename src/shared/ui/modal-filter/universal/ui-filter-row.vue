<script setup lang="ts">

</script>

<template>
	<div :class="classes.row">
		<slot />
	</div>
</template>

<style module="classes">
.row {
	display: flex;
	width: 100%;
}
</style>
