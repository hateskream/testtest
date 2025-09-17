<script setup lang="ts">

</script>

<template>
	<div :class="classes.title">
		<slot name="default" />
	</div>
</template>

<style module="classes">
.title {
	padding: 12px 12px 10px;
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	text-transform: capitalize;
	letter-spacing: 0.052px;
}
</style>
