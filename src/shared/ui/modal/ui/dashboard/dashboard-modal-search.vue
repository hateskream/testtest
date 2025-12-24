<script setup lang="ts">
import { useTemplateRef } from 'vue';

const props = withDefaults(defineProps<{
	placeholder?: string;
}>(), {
	placeholder: 'Type to search...',
});

const model = defineModel<string>();

const input = useTemplateRef('input');

function focus() {
	input.value?.focus();
}

defineExpose({ focus });
</script>

<template>
	<div :class="classes.root">
		<input
			ref="input"
			v-model="model"
			type="text"
			:placeholder="props.placeholder"
			:class="classes.input"
			class="text-300-r"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: flex-start;
	align-self: stretch;
	width: 100%;
	padding:
		var(--padding-padding-s7, 12px) var(--padding-padding-s10, 18px)
		var(--padding-padding-s5, 8px) var(--padding-padding-s10, 18px);
	gap: var(--padding-padding-s2, 2px);
	border-bottom: 1px solid var(--border-surf-04, rgb(73 73 80 / 32%));
}

.input {
	width: 100%;
	height: 100%;
	font-style: normal;
	text-align: left;
	color: rgb(255 255 255 / 100%);
	background: none;

	&::placeholder {
		color: var(--text-100, rgb(255 255 255 / 30%));
	}
}
</style>
