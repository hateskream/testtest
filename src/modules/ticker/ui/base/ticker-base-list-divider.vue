<script setup lang="ts">

</script>

<template>
	<div :class="classes.divider">
		<div :class="classes.line" />
	</div>
</template>

<style module="classes">
.divider {
	display: flex;
	align-items: center;
	align-self: stretch;
	width: 100%;
	padding: var(--padding-padding-s2, 2px) 0;
}

.line {
	flex: 1 0 0;
	height: 1px;
	background-color: var(--border-surf-04, rgb(73 73 80 / 32%));
}
</style>
