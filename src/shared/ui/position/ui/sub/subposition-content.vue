<script setup lang="ts">
import {
	watch,
	toValue,
	computed,
	nextTick,
	onMounted,
	onUnmounted,
	useTemplateRef,
	type CSSProperties,
} from 'vue';
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';

import type { ISubpositionContentProps } from '../../model';
import { matchesTrigger } from '../../utils';
import { useSubFloatingContext } from '../../composables';

const props = withDefaults(defineProps<ISubpositionContentProps>(), {
	placement: 'right-end',
	offset: 6,
	strategy: 'absolute',
	hoverPadding: 4,
	transform: true,
});

const contentRef = useTemplateRef('content');

const {
	isOpen,
	isPinned,
	triggerRef,
	trigger: _trigger,
	registerContent,
	events,
} = useSubFloatingContext();

const trigger = () => toValue(_trigger);

let cleanup: null | (() => void) = null;

const { floatingStyles, update, placement } = useFloating(triggerRef, contentRef, {
	placement: props.placement,
	strategy: props.strategy,
	middleware: [offset(props.offset), flip(), shift({ padding: 4 })],
	transform: true,
});

const enhancedFloatingStyles = computed(() => {
	if (!floatingStyles.value) {
		return {};
	}
	const baseStyles = floatingStyles.value;

	if (matchesTrigger(trigger(), 'hover')) {
		const padding = props.hoverPadding;
		let paddingStyle: CSSProperties = {};

		if (placement.value?.startsWith('right')) {
			paddingStyle = { paddingLeft: `${padding}px` };
		} else if (placement.value?.startsWith('left')) {
			paddingStyle = { paddingRight: `${padding}px` };
		} else if (placement.value?.startsWith('top')) {
			paddingStyle = { paddingBottom: `${padding}px`, marginBottom: `-${padding}px` };
		} else if (placement.value?.startsWith('bottom')) {
			paddingStyle = { paddingTop: `${padding}px`, marginTop: `-${padding}px` };
		}

		return { ...baseStyles, ...paddingStyle };
	}

	return baseStyles;
});


function handleOpen() {
	nextTick(() => {
		if (!triggerRef.value || !contentRef.value) {
			return;
		}

		cleanup = autoUpdate(triggerRef.value, contentRef.value, update);

		if (matchesTrigger(trigger(), 'hover')) {
			contentRef.value.addEventListener('mouseenter', events.hover.onFloatingEnter);
			contentRef.value.addEventListener('mouseleave', events.hover.onFloatingLeave);
		}
	});
}

function dispose() {
	cleanup?.();
	cleanup = null;
	contentRef.value?.removeEventListener('mouseenter', events.hover.onFloatingEnter);
	contentRef.value?.removeEventListener('mouseleave', events.hover.onFloatingLeave);
}

onMounted(() => {
	if (contentRef.value) {
		registerContent(contentRef.value);
	}
});

onUnmounted(dispose);

watch(isOpen, (v) => (v ? handleOpen() : dispose()), {
	immediate: true,
});
</script>

<template>
	<div
		v-if="isOpen"
		ref="content"
		:style="enhancedFloatingStyles"
		data-subposition-content
		:data-open="isOpen"
		:data-pinned="isPinned"
	>
		<slot />
	</div>
</template>

<style scoped>

</style>
