<script setup lang="ts">
import BaseFilterModalTitle from './base-filter-modal-title-component.vue';
</script>

<template>
	<div :class="classes.container">
		<base-filter-modal-title>
			<slot name="title" />
		</base-filter-modal-title>

		<slot name="content" />
	</div>
</template>

<style module="classes">
.container {
	position: absolute;
	top: 0;
	left: 100%;
	width: max-content;
	min-width: 463px;
	padding: 0 16px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}
</style>
