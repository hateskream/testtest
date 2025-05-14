<script setup lang="ts">

</script>

<template>
	<div :class="classes.wrapper">
		<slot />
	</div>
</template>

<style module="classes">
.wrapper {
	background: var(--bg-color-surface-03);
	border: 1px solid var(--border-color-surface-02, rgb(199 199 199 / 10%));
	border-radius: 18px;
	box-shadow: 0 8px 22px 0 rgb(0 0 0 / 30%);
	backdrop-filter: blur(14px);
}
</style>
