<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

import type { IFloatingOptions } from '../model';
import { matchesTrigger } from '../utils';

interface IPositionComponentEmits {
	(e: 'mouseover'): void;
	(e: 'mouseleave'): void;
}

interface ISubpositionProps extends IFloatingOptions {
	hoverPadding?: number;
}

const props = withDefaults(defineProps<ISubpositionProps>(), {
	placement: 'right-end',
	trigger: 'hover',
	offset: 6,
	strategy: 'fixed',
	hoverPadding: 8,
});

const emits = defineEmits<IPositionComponentEmits>();

const reference = useTemplateRef<HTMLElement>('reference');
const floating = useTemplateRef<HTMLElement>('floating');
const wrapper = useTemplateRef<HTMLElement>('wrapper');

const isVisible = ref(false);
const isPinned = ref(false);

const { floatingStyles, placement } = useFloating(reference, floating, {
	strategy: props.strategy,
	placement: props.placement,
	middleware: [offset(props.offset - 2), flip(), shift({ padding: 5 })],
	whileElementsMounted: autoUpdate,
});

const showTimeout = ref<number | null>(null);
const hideTimeout = ref<number | null>(null);

const enhancedFloatingStyles = computed(() => {
	if (!floatingStyles.value) {
		return {};
	}
	const baseStyles = floatingStyles.value;

	if (matchesTrigger(props.trigger, 'hover')) {
		const padding = props.hoverPadding;
		let paddingStyle: Record<string, string> = {};
		if (placement.value?.startsWith('right')) {
			paddingStyle = { paddingLeft: `${padding}px`, marginLeft: `-${padding}px` };
		} else if (placement.value?.startsWith('left')) {
			paddingStyle = { paddingRight: `${padding}px`, marginRight: `-${padding}px` };
		} else if (placement.value?.startsWith('top')) {
			paddingStyle = { paddingBottom: `${padding}px`, marginBottom: `-${padding}px` };
		} else if (placement.value?.startsWith('bottom')) {
			paddingStyle = { paddingTop: `${padding}px`, marginTop: `-${padding}px` };
		}
		return { ...baseStyles, ...paddingStyle };
	}

	return baseStyles;
});

function handleClick() {
	if (!matchesTrigger(props.trigger, 'hover')) {
		isVisible.value = !isVisible.value;
	}

	if (!isPinned.value) {
		isPinned.value = true;
		isVisible.value = true;
	} else {
		isPinned.value = false;
		isVisible.value = false;
	}
}

function handleMouseover(e: MouseEvent) {
	e.stopPropagation();

	if (isPinned.value) {
		return;
	}

	if (hideTimeout.value) {
		clearTimeout(hideTimeout.value);
		hideTimeout.value = null;
	}
	if (isVisible.value || showTimeout.value) {
		return;
	}

	isVisible.value = true;
	emits('mouseover');
	showTimeout.value = null;
}

function handleMouseleave() {
	if (isPinned.value) {
		return;
	}

	if (showTimeout.value) {
		clearTimeout(showTimeout.value);
		showTimeout.value = null;
	}

	isVisible.value = false;
	emits('mouseleave');
	hideTimeout.value = null;
}

function handleFloatingMouseenter() {
	if (isPinned.value) {
		return;
	}

	if (matchesTrigger(props.trigger, 'hover') && hideTimeout.value) {
		clearTimeout(hideTimeout.value);
		hideTimeout.value = null;
	}
}

function handleFloatingMouseleave(e: MouseEvent) {
	if (isPinned.value) {
		return;
	}

	const related = e.relatedTarget as HTMLElement | null;

	if (reference.value && related && reference.value.contains(related)) {
		return;
	}

	if (showTimeout.value) {
		clearTimeout(showTimeout.value);
		showTimeout.value = null;
	}

	isVisible.value = false;
	emits('mouseleave');
	hideTimeout.value = null;
}

const handleDocumentClick = (event: Event) => {
	const target = event.target as Element;
	if (wrapper.value?.contains(target)) {
		return;
	}
	if (floating.value?.contains(target)) {
		return;
	}
	isPinned.value = false;
	isVisible.value = false;
};

onMounted(() => {
	const wrapperEl = wrapper.value;
	const triggerEl = reference.value;

	if (!wrapperEl || !triggerEl) {
		return;
	}

	const { trigger } = props;

	document.addEventListener('click', handleDocumentClick, true);
	triggerEl.addEventListener('click', handleClick);

	if (matchesTrigger(trigger, 'contextmenu')) {
		wrapperEl.addEventListener('contextmenu', handleClick);
	}

	if (matchesTrigger(trigger, 'hover')) {
		wrapperEl.addEventListener('mouseenter', handleMouseover);
		wrapperEl.addEventListener('mouseleave', handleMouseleave);
	}

	onUnmounted(() => {
		wrapperEl.removeEventListener('contextmenu', handleClick);
		wrapperEl.removeEventListener('click', handleClick);
		triggerEl.removeEventListener('click', handleClick);
		wrapperEl.removeEventListener('mouseenter', handleMouseover);
		wrapperEl.removeEventListener('mouseleave', handleMouseleave);

		document.removeEventListener('click', handleDocumentClick, true);
	});
});

defineExpose({ isVisible, isPinned, handleClick });
</script>

<template>
	<div ref="wrapper">
		<div ref="reference">
			<slot
				name="title"
				:is-visible="isVisible"
				:is-pinned="isPinned"
			/>
		</div>
		<transition name="fade">
			<div
				v-if="isVisible"
				ref="floating"
				:style="enhancedFloatingStyles"
				class="submenu"
				@mouseenter="handleFloatingMouseenter"
				@mouseleave="handleFloatingMouseleave"
			>
				<div class="inner" :style="{ padding: `${props.offset}px` }">
					<div class="scroll-wrapper">
						<slot name="content" />
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.floating-content {
	z-index: 101;
}

.inner {
	border-radius: 6px;
}

.scroll-wrapper {
	max-height: 80svh;
	overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
	pointer-events: none;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
