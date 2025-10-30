<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

const props = withDefaults(defineProps<{
	placeholder?: string;
	showIcon?: boolean;
}>(), {
	placeholder: 'Type to search...',
	showIcon: true,
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
		<ui-icon
			v-if="showIcon"
			:id="IconIds.Search"
			:class="classes.icon"
			width="20px"
			height="20px"
		/>
		<input
			ref="input"
			v-model="model"
			type="text"
			:placeholder="props.placeholder"
			:class="classes.input"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: row;
	align-items: center;
	align-self: stretch;
	width: 100%;
	height: 42px;
	gap: 12px;
}

.icon {
	color: rgb(100 101 104 / 100%);
}

.input {
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	line-height: normal;
	font-family: 'Roboto Flex', sans-serif;
	text-align: left;
	background: none;

	&::placeholder {
		color: rgb(100 101 104 / 100%);
	}
}
</style>
