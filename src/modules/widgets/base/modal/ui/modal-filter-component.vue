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
	min-width: 208px;
	max-height: 80svh;
	padding: 6px;
	overflow-x: hidden;
	overflow-y: auto;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
	scrollbar-gutter: stable;
}

@supports (-moz-appearance: none) {
	.container:not(:hover) {
		scrollbar-width: none;
	}

	.container {
		scrollbar-width: unset;
	}
}

.container:not(:hover)::-webkit-scrollbar {
	display: none;
}

.container:hover::-webkit-scrollbar {
	width: 6px;
}
</style>
