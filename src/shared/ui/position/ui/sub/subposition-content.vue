<script setup lang="ts">
import {
	watch,
	toValue,
	computed,
	nextTick,
	onMounted,
	onUnmounted,
	useTemplateRef,
	type CSSProperties, ref,
} from 'vue';
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';

import { type ISubpositionContentProps, parseAutoUpdate } from '../../model';
import { matchesTrigger } from '../../utils';
import { usePinnedLevel, useSubFloatingContext } from '../../composables';

const props = withDefaults(defineProps<ISubpositionContentProps>(), {
	autoUpdate: true,
	placement: 'right-end',
	offset: 6,
	strategy: 'absolute',
	hoverPadding: 4,
	transform: true,
});

const contentRef = useTemplateRef('content');

const level = usePinnedLevel();
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
	middleware: [
		offset(props.offset),
		shift({ padding: 8 }),
		flip({ padding: 8 }),
	],
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

const memorizedStyles = ref<CSSStyleValue | null>(null);

function handleOpen() {
	nextTick(() => {
		if (!triggerRef.value || !contentRef.value) {
			return;
		}

		if (!props.memorize && props.autoUpdate) {
			cleanup = autoUpdate(
				triggerRef.value,
				contentRef.value,
				update,
				parseAutoUpdate(props.autoUpdate),
			);
		}

		if (matchesTrigger(trigger(), 'hover')) {
			contentRef.value.addEventListener('mouseenter', events.hover.onFloatingEnter);
			contentRef.value.addEventListener('mouseleave', events.hover.onFloatingLeave);
		}
	});
}

function dispose() {
	cleanup?.();
	cleanup = null;
	memorizedStyles.value = null;
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

watch(enhancedFloatingStyles, (value, oldValue) => {
	if (!props.memorize) {
		return;
	}

	if (isOpen.value && !oldValue) {
		memorizedStyles.value = value;
	} else {
		memorizedStyles.value = null;
	}
}, { deep: true });
</script>

<template>
	<div
		v-if="isOpen"
		ref="content"
		:style="[memorizedStyles || enhancedFloatingStyles, { zIndex: 100 + level }]"
		data-subposition-content
		:data-open="isOpen"
		:data-pinned="isPinned"
	>
		<slot />
	</div>
</template>

<style scoped>

</style>
