<script setup lang="ts">
import { computed, onMounted, onUnmounted, toValue, useTemplateRef } from 'vue';

import { useSubFloatingContext } from '../../composables';
import { matchesTrigger } from '../../utils';

const emits = defineEmits<{
	onTriggerMouseEnter: [];
	onTriggerMouseLeave: [];
}>();

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

function handleEnter() {
	if (!isOpen.value && !isPinned.value) {
		events.hover.onMouseEnter();
		emits('onTriggerMouseEnter');
	}
}

function handleLeave() {
	if (!isPinned.value) {
		events.hover.onMouseLeave();
		emits('onTriggerMouseLeave');
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
		triggerRef.value.addEventListener('mouseenter', handleEnter);
		triggerRef.value.addEventListener('mouseleave', handleLeave);
	}
}

function remove() {
	if (!triggerRef.value) {
		return;
	}
	triggerRef.value.removeEventListener('contextmenu', handleClick);
	triggerRef.value.removeEventListener('click', handleClick);
	triggerRef.value.removeEventListener('mouseenter', handleEnter);
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
