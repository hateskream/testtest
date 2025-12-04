<script setup lang="ts">
import { useTemplateRef } from 'vue';

interface ISearchComponentProps {
	modelValue: string;
	placeholder?: string;
}

withDefaults(defineProps<ISearchComponentProps>(), {
	placeholder: 'Press / and start typing',
});

interface ISearchComponentEmits {
	(e: 'update:modelValue', data: string): void;
}

const emits = defineEmits<ISearchComponentEmits>();

function handleUpdate(e: Event) {
	const target = e.target as HTMLInputElement;
	emits('update:modelValue', target.value);
}

const input = useTemplateRef('input');

function focus() {
	input.value?.focus();
}

defineExpose({ focus });
</script>

<template>
	<input
		ref="input"
		type="text"
		:value="modelValue"
		:class="classes.input"
		:placeholder="placeholder"
		@input="handleUpdate"
	/>
</template>

<style module="classes">
.input {
	width: 100%;
	height: 26px;
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	line-height: normal;
	text-align: left;
	color: var(--text-color-base-500);
	caret-color: var(--text-color-base-300-activated);
	background-color: inherit;
	border: none;

	&::placeholder {
		color: var(--text-color-base-100);
	}
}
</style>
