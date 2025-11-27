<script setup lang="ts">

</script>

<template>
	<div :class="classes.title">
		<slot />
	</div>
</template>

<style module="classes">
.title {
	display: flex;
	align-items: center;
	align-self: stretch;
	height: 40px;
	padding: 0 var(--padding-padding-s9, 16px);
	font-style: normal;
	font-weight: 510;
	font-size: var(--font-text-200-b-size, 12.2px);
	line-height: 180%; /* 21.96px */
	color: var(--color-text-base-500, #ffffff);
	letter-spacing: 0.122px;
}
</style>
