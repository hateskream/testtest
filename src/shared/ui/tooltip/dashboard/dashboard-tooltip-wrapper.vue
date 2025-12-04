<script setup lang="ts">

</script>

<template>
	<div :class="classes.tooltip">
		<slot />
	</div>
</template>

<style module="classes">
.tooltip {
	z-index: 100;
	display: flex;
	width: max-content;
	padding: var(--padding-padding-s6, 4px) var(--padding-padding-s8, 10px);
	font-size: 12px;
	color: var(--text-color-base-300);
	background: var(--surface-modal, rgb(30 30 32 / 88%));
	background-color: var(--surface-modal, rgb(30 30 32 / 88%));
	border: 1px solid var(--border-surf-04, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s14-32, 12.4px);
	backdrop-filter: blur(9px);
}
</style>
