<script setup lang="ts">
import { nextTick, ref, useTemplateRef, useCssModule, watch } from 'vue';

import type { ITabUi } from '@/modules/widgets/watchlist/model';
import { UiIcon, IconIds } from '@/shared/ui/icon';

interface ITabWithEditing extends ITabUi {
	isEditing: boolean;
}

interface IWatchlistTabProps {
	tab: ITabWithEditing;
	isOpen?: boolean;
}

const props = defineProps<IWatchlistTabProps>();

const emit = defineEmits<{
	switch: [id: string];
	rename: [id: string, name: string];
	openModal: [id: string];
}>();

const CLICK_DELAY = 200;
const clickTimeout = ref<number | null>(null);

const tabRenameInputRef = useTemplateRef<HTMLInputElement>('tabRenameInputRef');
const isEditing = ref(false);
const inputModel = ref(props.tab.name);

const classes = useCssModule('classes');

watch(
	() => props.tab.isEditing,
	newState => {
		if (newState) {
			openRenameInput();
		}
	},
);

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

function finishEditing(event: Event) {
	if (event?.type !== 'blur') {
		tabRenameInputRef.value?.blur();
		return;
	}

	if (inputModel.value.trim()) {
		emit('rename', props.tab.id, inputModel.value.trim());
	}

	isEditing.value = false;
	inputModel.value = props.tab.name;
};

async function openRenameInput() {
	isEditing.value = true;

	await nextTick();

	const input = tabRenameInputRef.value;
	if (!input) {
		return;
	}

	input.focus();
	input.select();
	adjustInputWidth(input, inputModel.value);
	input.addEventListener('input', () => {
		adjustInputWidth(input, inputModel.value);
	});
};

function onDoubleClick() {
	if (clickTimeout.value) {
		clearTimeout(clickTimeout.value);
		clickTimeout.value = null;
	}

	if (!props.tab.isActive) {
		return;
	}

	openRenameInput();
};

function onSingleClick() {
	if (clickTimeout.value) {
		return;
	}

	if (isEditing.value) {
		return;
	}

	clickTimeout.value = window.setTimeout(() => {
		if (props.tab.isActive) {
			emit('openModal', props.tab.id);
		}

		emit('switch', props.tab.id);

		clickTimeout.value = null;
	}, CLICK_DELAY);
};

defineExpose({ openRenameInput });
</script>

<template>
	<div
		:class="[
			classes.watchlistTab,
			props.tab.isActive ? classes.active : {}
		]"
		@dblclick="onDoubleClick"
		@click.stop="onSingleClick"
	>
		<input
			v-if="isEditing"
			ref="tabRenameInputRef"
			v-model="inputModel"
			:class="classes.tabRenameInput"
			@blur="finishEditing"
			@keyup.enter="finishEditing"
		/>
		<span v-else :class="classes.tabLabel">{{ props.tab.name }}</span>
		<ui-icon
			v-if="props.tab.isActive"
			:id="IconIds.DropdownDown"
			:class="[
				classes.icon,
				props.isOpen ? classes.icon__open : classes.icon__close
			]"
			width="12px"
			height="12px"
		/>
	</div>
</template>

<style module="classes">
.watchlistTab {
	display: flex;
	align-items: center;
	align-self: stretch;
	height: auto;
	padding: 4px 8px 4px 12px;
	font-size: var(--typography-paragraph-size-p-01);
	color: var(--text-color-base-300);
	border-radius: 28px;
	cursor: pointer;
	gap: 2px;
}

.active {
	color: var(--text-color-base-300-activated);
	background: var(--bg-color-base-300);
}

.tabRenameInput {
	min-width: 1ch;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-01);
	line-height: 170%;
	letter-spacing: 0.096px;
	background: transparent;
}

.tabLabel {
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-01);
	line-height: 170%;
	letter-spacing: 0.096px;
	text-wrap: nowrap;
}

.icon {
	color: var(--icon-color-base-300);
}

.icon__open {
	transition: transform 0.3s ease;
}

.icon__close {
	transform: rotate(-90deg);
	transition: transform 0.3s ease;
}
</style>
