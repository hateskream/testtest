<script setup lang="ts">
import { ref, watch, computed } from 'vue';

import { useСanDelete } from '../composables';
import { IconIds, UiIcon } from '@/shared/ui/icon';

const emit = defineEmits<{ (e: 'set-can-delete', value: boolean): void }>();

const deleteRef = ref<HTMLDivElement | null>(null);

const { canDelete, isMouseInDeleteControlElement } = useСanDelete(deleteRef);

const currentIcon = computed(() => isMouseInDeleteControlElement.value ? IconIds.TrashOpen : IconIds.TrashClose);

watch(canDelete,
	(newValue) => {
		emit('set-can-delete', newValue);
	},
);
</script>

<template>
	<div :class="classes.root">
		<div ref="deleteRef" :class="classes.deleteContainer" />
		<div :class="classes.iconContainer">
			<ui-icon :id="currentIcon" />
		</div>
		<transition
			:enter-active-class="classes.enterActive"
			:enter-from-class="classes.enterFrom"
			:leave-active-class="classes.leaveActive"
			:leave-to-class="classes.leaveTo"
		>
			<div v-if="isMouseInDeleteControlElement" :class="classes.deleteMessage">Remove widget</div>
		</transition>
	</div>
</template>

<style module="classes">
.root {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 48px;
	height: 48px;
}

.deleteContainer {
	position: fixed;
	right: 0;
	bottom: 0;
	width: 160px;
	height: 100px;
}

.iconContainer {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 42px;
	height: 42px;
	background: var(--bg-color-base-300-effect);
	border-radius: 8px;
}

.deleteMessage {
	position: fixed;
	right: 74px;
	bottom: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 114px;
	height: 32px;
	font-style: normal;
	font-weight: 440;
	font-size: 12px;
	line-height: 170%;
	color: var(--text-color-base-300);
	letter-spacing: 0.096px;
	background-color: rgb(37 37 39 / 65%);
	border: 1px solid rgb(255 255 255 / 8%);
	border-radius: 8px;
}


.enterActive,
.leaveActive {
	transition: opacity 0.3s ease;
}

.enterFrom,
.leaveTo {
	opacity: 0;
}
</style>
