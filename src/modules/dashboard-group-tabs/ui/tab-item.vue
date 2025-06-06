<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { templateRef } from '@vueuse/core';

import type { IDashboardTab } from '@/modules/dashboard-group/model';

import TabWrapper from './tab-wrapper.vue';

interface ITabItemProps {
	tab: IDashboardTab;
}

const props = defineProps<ITabItemProps>();

const emit = defineEmits<{
	switch: [id: string];
	rename: [id: string, name: string];
}>();

const editing = ref(false);
const tabName = ref(props.tab.name);
const isInitialEdit = ref(true);

function startEditing() {
	editing.value = true;
	isInitialEdit.value = true;

	nextTick(() => {
		const input = document.querySelector('input') as HTMLInputElement;
		if (!input) {
			return;
		}

		input.select();
		adjustInputWidth(input, tabName.value);
		input.addEventListener('input', () => {
			isInitialEdit.value = false;
			adjustInputWidth(input, tabName.value);
		});
		input.addEventListener(
			'click',
			() => {
				isInitialEdit.value = false;
			},
			{ once: true },
		);
	});
}

const tabRenameInputRef = templateRef('tabRenameInputRef');
function finishEditing(event: Event) {
	if (event?.type !== 'blur') {
		tabRenameInputRef.value.blur();
		return;
	}

	if (tabName.value.trim()) {
		emit('rename', props.tab.id, tabName.value.trim());
	}

	editing.value = false;
	isInitialEdit.value = true;
}

function adjustInputWidth(input: HTMLInputElement, text: string) {
	const measurer = document.createElement('span');
	measurer.style.visibility = 'hidden';
	measurer.style.position = 'absolute';
	measurer.style.whiteSpace = 'nowrap';
	measurer.style.font = window.getComputedStyle(input).font;
	measurer.textContent = text || ' ';
	document.body.appendChild(measurer);
	input.style.width = `${measurer.offsetWidth}px`;
	document.body.removeChild(measurer);
}

defineExpose({ startEditing });
</script>

<template>
	<tab-wrapper
		:is-active="tab.isActive"
		:is-editing="editing"
		:class="classes.tab"
		@click="emit('switch', tab.id)"
	>
		<input
			v-if="editing"
			ref="tabRenameInputRef"
			v-model="tabName"
			:class="{ [classes.initialEdit]: isInitialEdit }"
			autofocus
			@blur="finishEditing"
			@keyup.enter="finishEditing"
		/>
		<span
			v-else
			@dblclick="startEditing"
		>
			{{ tab.name }}
		</span>
	</tab-wrapper>
</template>

<style module="classes">
.tab::selection {
	color: var(--text-color-contrast-500);
	background-color: #ffffff;
}

input {
	min-width: 1ch;
	padding: 0;
	font-weight: 300;
	font-size: 13px;
	line-height: 170%;
	text-align: center;
	color: var(--text-color-base-500);
	letter-spacing: 0.8;
	background-color: var(--bg-color-base-300);
	border: none;
	outline: none;
	caret-color: var(--text-color-base-300-activated);
}

input:focus {
	caret-color: var(--text-color-base-300-activated);
}

input.initialEdit {
	color: var(--text-color-contrast-500);
	background-color: #ffffff;
}

input::selection {
	color: var(--text-color-contrast-500);
	background-color: #ffffff;
}
</style>
