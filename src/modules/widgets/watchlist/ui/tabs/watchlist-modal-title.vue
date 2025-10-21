<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue';

import type { ITab } from '@/modules/widgets/watchlist/model';

interface ITabWithEditing extends ITab {
	isEditing: boolean;
}

const props = defineProps<{
	tab: ITabWithEditing;
}>();

const emits = defineEmits<{
	rename: [id: string, name: string];
}>();

const tabRenameInputRef = useTemplateRef<HTMLInputElement>('tabRenameInputRef');
const isEditing = ref(false);
const inputModel = ref(props.tab.name);

function finishEditing(event: Event) {
	if (event?.type !== 'blur') {
		tabRenameInputRef.value?.blur();
		return;
	}

	if (inputModel.value.trim()) {
		emits('rename', props.tab.id, inputModel.value.trim());
	}

	isEditing.value = false;
	inputModel.value = props.tab.name;
}
async function openRenameInput() {
	isEditing.value = true;

	await nextTick();

	const input = tabRenameInputRef.value;
	if (!input) {
		return;
	}

	input.focus();
	input.select();
}

watch(
	() => props.tab.isEditing,
	newState => {
		if (newState) {
			openRenameInput();
		}
	},
);
</script>

<template>
	<input
		v-if="isEditing"
		ref="tabRenameInputRef"
		v-model="inputModel"
		maxlength="15"
		:class="classes.input"
		@blur="finishEditing"
		@keyup.enter="finishEditing"
	>

	<span v-else>
		{{tab.name}}
	</span>
</template>

<style module="classes">
.input {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	font-weight: 300;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-500);
	background: none;
	cursor: pointer;
}
</style>
