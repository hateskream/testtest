<script setup lang="ts">

</script>

<template>
	<div :class="classes.wrapper">
		<slot />
	</div>
</template>

<style module="classes">
.wrapper {
	border-radius:  18px;
	border: 1px solid var(--border-color-surface-02, rgba(199, 199, 199, 0.10));
	background: var(--bg-color-surface-03);
	box-shadow: 0px 8px 22px 0px rgba(0, 0, 0, 0.30);
	backdrop-filter: blur(14px);
}
</style>
