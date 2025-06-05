<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { templateRef } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type IDashboardTab } from '@/modules/dashboard-group';

import TabItem from './tab-item.vue';
import TabWrapper from './tab-wrapper.vue';

interface ITabsComponentProps {
	tabs: IDashboardTab[];
}

const props = defineProps<ITabsComponentProps>();

const emit = defineEmits<{
	(event: 'add-tab', name: string): void;
	(event: 'switch-tab', id: string): void;
	(event: 'rename-tab', id: string, name: string): void;
}>();

const tabRenameInputRef = templateRef('tabRenameInputRef');
const newTabName = ref('Dashboard');
const isEditing = ref(false);

function onAddTab() {
	isEditing.value = true;
	nextTick(() => {
		tabRenameInputRef.value?.focus();
		tabRenameInputRef.value?.select();
	});
}

function onSaveNewTab(event: Event) {
	if (event?.type !== 'blur') {
		tabRenameInputRef.value.blur();
		return;
	}

	if (!newTabName.value.trim()) {
		return;
	}

	emit('add-tab', newTabName.value);
	isEditing.value = false;
	newTabName.value = 'Dashboard';

}

function onSwitchTab(id: string) {
	emit('switch-tab', id);
}

function onRenameTab(id: string, name: string) {
	emit('rename-tab', id, name);
}
</script>

<template>
	<div :class="classes.tabs">
		<tab-item
			v-for="tab in props.tabs"
			:key="tab.id"
			:tab="tab"
			@switch="onSwitchTab"
			@rename="onRenameTab"
		/>

		<tab-wrapper
			v-if="isEditing"
			class="editing"
			is-editing
		>
			<input
				ref="tabRenameInputRef"
				v-model="newTabName"
				:class="classes.tabRenameInput"
				type="text"
				@keydown.enter="onSaveNewTab"
				@blur="onSaveNewTab"
			/>
		</tab-wrapper>

		<tab-wrapper @click="onAddTab">
			<ui-icon
				:id="IconIds.Plus"
				width="12px"
				height="12px"
			/>
			New
		</tab-wrapper>
	</div>
</template>

<style module="classes">
.tabs {
	display: flex;
	gap: 10px;
	justify-content: center;
}

.tabRenameInput {
	width: 100px;
	font-weight: 300;
	font-size: 13px;
	line-height: 170%;
	color: #ffffff;
	letter-spacing: 0.8px;
	background: transparent;
	border: none;
	outline: none;
}
</style>
