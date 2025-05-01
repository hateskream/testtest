<script setup lang="ts">
import ModalFilterTitle from './modal-filter-title-component.vue';
</script>

<template>
	<div :class="classes.container">
		<modal-filter-title>
			<slot name="title" />
		</modal-filter-title>

		<slot name="content" />
	</div>
</template>

<style module="classes">
.container {
	width: max-content;
	min-width: 463px;
	padding: 0 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}
</style>
