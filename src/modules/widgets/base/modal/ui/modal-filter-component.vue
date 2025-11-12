<script setup lang="ts">
import ModalFilterTitle from './modal-filter-title-component.vue';
</script>

<template>
	<div :class="classes.container">
		<modal-filter-title v-if="$slots.title">
			<slot name="title" />
		</modal-filter-title>

		<slot name="content" />
	</div>
</template>

<style module="classes">
.container {
	width: max-content;
	max-height: 80svh;
	padding: 6px;
	overflow-y: auto;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}
</style>
