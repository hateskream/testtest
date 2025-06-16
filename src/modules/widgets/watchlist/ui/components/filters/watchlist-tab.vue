<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';

import type { IWatchlistTab } from '@/modules/widgets/watchlist/model';
import { UiIcon, IconIds } from '@/shared/ui/icon';
import { useWatchlistTabsStore } from '@/modules/widgets/watchlist/stores/watchlist-tabs.store';

const tabsStore = useWatchlistTabsStore();

interface IWatchlistTabProps {
	tab: IWatchlistTab;
	isOpen?: boolean;
	isRenaming?: boolean;
}

const props = defineProps<IWatchlistTabProps>();

const isEditing = ref(false);
const tabRenameInputRef = useTemplateRef('tabRenameInputRef');
const inputModel = ref(props.tab.name);

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

const stopEditing = (tabId: string, newName: string) => {
	tabsStore.renameTab(tabId, newName);
	inputModel.value = '';
	tabsStore.stopRenameState();

	isEditing.value = false;
	inputModel.value = props.tab.name;
};

const onDoubleClick = async () => {
	if (!props.tab.isActive) {
		return;
	}
	isEditing.value = true;

	await nextTick();

	const input = tabRenameInputRef.value as HTMLInputElement;
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

</script>

<template>
	<div :class="classes.watchlistTab" @dblclick="onDoubleClick">
		<input
			v-if="isEditing"
			ref="tabRenameInputRef"
			v-model="inputModel"
			:class="classes.tabRenameInput"
			@blur="stopEditing(props.tab.id, inputModel)"
			@keyup.enter="stopEditing(props.tab.id, inputModel)"
		/>
		<span v-else :class="classes.tabLabel">{{ props.tab.name }}</span>
		<ui-icon
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
	padding: 8px 12px;
	background: var(--bg-color-base-300);
	border-radius: 9999px;
	gap: 2px;
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
	color: var(--text-color-base-300-activated);
	letter-spacing: 0.096px;
}

.icon {
	color: var(--icon-color-base-300);
}

.icon__open {
	transform: rotate(180deg);
	transition: transform 0.3s ease;
}

.icon__close {
	transition: transform 0.3s ease;
}
</style>
