<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { ref, useTemplateRef } from 'vue';

const isVisible = ref(false);

const modalRef = useTemplateRef('modal');

onClickOutside(modalRef, () => {
	isVisible.value = false;
});
</script>

<template>
	<div
		ref="modal"
		:class="classes.container"
	>
		<div
			:class="classes.title"
			@click="isVisible = !isVisible"
		>
			<slot name="title" />
		</div>

		<div
			v-show="isVisible"
			:class="classes.content"
		>
			<slot name="content" />
		</div>
	</div>
</template>

<style module="classes">
.container {
	position: relative;
	z-index: 20;
}

.content {
	position: absolute;
	width: max-content;
	min-width: 208px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}

.title {
	padding: 7.5px 12px;
	font-weight: 300;
	font-size: 10px;
	text-align: left;
	color: var(--text-color-base-300);
	background-color: var(--bg-color-base-300);
	border-radius: 18px;
	cursor: pointer;
}
</style>
