<script setup lang="ts">
import { computed, onMounted, onUnmounted, toValue, useTemplateRef } from 'vue';

import { useSubFloatingContext } from '../../composables';
import { matchesTrigger } from '../../utils';

const triggerRef = useTemplateRef('trigger');

const {
	events,
	isOpen,
	isPinned,
	trigger: _trigger,
	registerTrigger,
	pin,
	unpin,
} = useSubFloatingContext();

const triggerProp = computed(() => {
	return toValue(_trigger);
});

function handleClick() {
	if (!matchesTrigger(triggerProp.value, 'hover')) {
		isOpen.value = !isOpen.value;
	}

	if (!isPinned.value) {
		pin();
	} else {
		unpin();
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

	triggerRef.value.addEventListener('click', handleClick);

	if (matchesTrigger(triggerProp.value, 'contextmenu')) {
		triggerRef.value.addEventListener('contextmenu', handleClick);
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
	triggerRef.value.removeEventListener('contextmenu', handleClick);
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

<style scoped>

</style>
