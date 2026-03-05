<script setup lang="ts"></script>

<template>
	<div :class="classes.row">
		<slot />
	</div>
</template>

<style module="classes">
.row {
	display: flex;
	align-items: center;
	align-self: stretch;
	padding: 3px 12px;
	gap: 4px;
}
</style>
