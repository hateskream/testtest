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
	margin: var(--padding-padding-s2, 2px) 0;
	padding: 0 9px;
}

.line {
	width: 100%;
	border-bottom: 1px solid rgb(255 255 255 / 8%);
}
</style>
