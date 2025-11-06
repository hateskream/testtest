<script setup lang="ts"></script>

<template>
	<div :class="classes.cell">
		<slot />
	</div>
</template>

<style module="classes">
.cell {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 6px;
	font-weight: 400;
	font-size: 10px;
	color: var(--text-color-base-300);
}
</style>
