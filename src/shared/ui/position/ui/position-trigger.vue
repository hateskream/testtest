<script setup lang="ts">
import { computed, onMounted, onUnmounted, toValue, useTemplateRef } from 'vue';

import { matchesTrigger } from '../utils';
import { useFloatingContext } from '../composables';

const triggerRef = useTemplateRef('trigger');

const {
	events,
	isOpen,
	isPinned,
	trigger: _trigger,
	registerTrigger,
	open,
	close,
} = useFloatingContext();

const triggerProp = computed(() => {
	return toValue(_trigger);
});

function handleContextMenu(e: MouseEvent) {
	if (!matchesTrigger(triggerProp.value, 'contextmenu')) {
		return;
	}

	e.preventDefault();
	isPinned.value = true;
	open();
}

function handleClick() {
	if (!matchesTrigger(triggerProp.value, 'click')) {
		return;
	}

	if (isOpen.value && isPinned.value) {
		close();
	} else {
		isPinned.value = true;
		open();
	}
}
function handleOver() {
	if (!matchesTrigger(triggerProp.value, 'hover')) {
		return;
	}

	if (!isOpen.value && !isPinned.value) {
		events.hover.onMouseEnter();
	}
}
function handleLeave() {
	if (!matchesTrigger(triggerProp.value, 'hover')) {
		return;
	}

	if (!isPinned.value) {
		events.hover.onMouseLeave();
	}
}

function add() {
	if (!triggerRef.value) {
		return;
	}

	registerTrigger(triggerRef.value);

	if (matchesTrigger(triggerProp.value, 'contextmenu')) {
		triggerRef.value.addEventListener('contextmenu', handleContextMenu);
	}
	if (matchesTrigger(triggerProp.value, 'click')) {
		triggerRef.value.addEventListener('click', handleClick);
	}
	if (matchesTrigger(triggerProp.value, 'hover')) {
		triggerRef.value.addEventListener('mouseover', handleOver);
		triggerRef.value.addEventListener('mouseleave', handleLeave);
	}
}
function remove() {
	if (!triggerRef.value) {
		return;
	}
	triggerRef.value.removeEventListener('contextmenu', handleContextMenu);
	triggerRef.value.removeEventListener('click', handleClick);
	triggerRef.value.removeEventListener('mouseover', handleOver);
	triggerRef.value.removeEventListener('mouseleave', handleLeave);
}

onMounted(add);
onUnmounted(remove);
</script>

<template>
	<div ref="trigger" data-position-trigger>
		<slot />
	</div>
</template>

<style>
</style>
