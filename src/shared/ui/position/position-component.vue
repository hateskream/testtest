<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';
import { computed, inject, nextTick, onMounted, onUnmounted, provide, ref, useTemplateRef } from 'vue';

import type { IFloatingContext, IPositionProps } from './types';

interface IPositionComponentEmits {
	(e: 'mouseover'): void;
	(e: 'mouseleave'): void;
}

const props = withDefaults(defineProps<IPositionProps>(), {
	position: 'right-end',
	trigger: 'click',
	showInMs: 100,
	hideDelayMs: 200,
	positionOffset: 6,
	strategy: 'fixed',
	hoverPadding: 8,
	teleport: 'body',
});

const emits = defineEmits<IPositionComponentEmits>();

const reference = useTemplateRef<HTMLElement>('reference');
const floating = useTemplateRef<HTMLElement>('floating');
const wrapper = useTemplateRef<HTMLElement>('wrapper');

const { floatingStyles, placement } = useFloating(reference, floating, {
	strategy: props.strategy,
	placement: props.position,
	middleware: [
		offset(props.positionOffset - 2),
		flip(),
		shift({ padding: 5 }),
	],
	whileElementsMounted: autoUpdate,
});

const isVisible = ref<boolean>(false);
const showTimeout = ref<number | null>(null);
const hideTimeout = ref<number | null>(null);

const parentContext = inject<IFloatingContext | null>('floating-context', null);
const currentLevel: number = (parentContext?.getCurrentLevel() ?? -1) + 1;
const floatingElements = ref<Map<HTMLElement, number>>(new Map());

const context: IFloatingContext = {
	registerFloating: (element: HTMLElement, level: number): void => {
		floatingElements.value.set(element, level);
		parentContext?.registerFloating(element, level);
	},
	unregisterFloating: (element: HTMLElement): void => {
		floatingElements.value.delete(element);
		parentContext?.unregisterFloating(element);
	},
	isInsideFloating: (target: Element): boolean => {
		for (const element of floatingElements.value.keys()) {
			if (element.contains(target)) {
				return true;
			}
		}
		return parentContext?.isInsideFloating(target) ?? false;
	},
	getCurrentLevel: (): number => currentLevel,
};

provide<IFloatingContext>('floating-context', context);

const enhancedFloatingStyles = computed(() => {
	if (!floatingStyles.value) {
		return {};
	}

	const baseStyles = floatingStyles.value;

	if (props.trigger === 'hover') {
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

		return {
			...baseStyles,
			...paddingStyle,
		};
	}

	return baseStyles;
});

onMounted(() => {
	nextTick(() => {
		if (floating.value) {
			context.registerFloating(floating.value, currentLevel);
		}
	});
});

onUnmounted(() => {
	if (floating.value) {
		context.unregisterFloating(floating.value);
	}

	if (showTimeout.value) {
		clearTimeout(showTimeout.value);
	}
	if (hideTimeout.value) {
		clearTimeout(hideTimeout.value);
	}
});

const handleDocumentClick = (event: Event): void => {
	if (props.trigger !== 'click') {
		return;
	}

	const target = event.target as Element;
	if (wrapper.value?.contains(target)) {
		return;
	}
	if (floating.value?.contains(target)) {
		return;
	}

	isVisible.value = false;
};

const setupClickOutside = (): void => {
	document.addEventListener('click', handleDocumentClick, true);
};

const cleanupClickOutside = (): void => {
	document.removeEventListener('click', handleDocumentClick, true);
};

onMounted(setupClickOutside);
onUnmounted(cleanupClickOutside);

function handleClick(): void {
	if (props.trigger === 'click') {
		isVisible.value = !isVisible.value;
	}
}

function isInsideAny(target: Element | null) {
	if (!target) {
		return false;
	}
	return wrapper.value?.contains(target) || floating.value?.contains(target);
}

function handleMouseover(event: MouseEvent): void {
	event.stopPropagation();

	if (props.trigger === 'hover') {
		if (hideTimeout.value) {
			clearTimeout(hideTimeout.value);
			hideTimeout.value = null;
		}

		if (isVisible.value || showTimeout.value) {
			return;
		}

		showTimeout.value = setTimeout(() => {
			isVisible.value = true;
			emits('mouseover');
			showTimeout.value = null;
		}, props.showInMs);
	}
}

function handleMouseleave(event: MouseEvent): void {
	if (props.trigger !== 'hover') {
		return;
	}
	const related = event.relatedTarget as Element | null;
	if (isInsideAny(related)) {
		return;
	}

	if (showTimeout.value) {
		clearTimeout(showTimeout.value);
		showTimeout.value = null;
	}

	hideTimeout.value = setTimeout(() => {
		isVisible.value = false;
		emits('mouseleave');
		hideTimeout.value = null;
	}, props.hideDelayMs);
}

function handleFloatingMouseenter(event: MouseEvent): void {
	event.stopPropagation();

	if (props.trigger === 'hover') {

		if (hideTimeout.value) {
			clearTimeout(hideTimeout.value);
			hideTimeout.value = null;
		}
	}
}

function handleFloatingMouseleave(event: MouseEvent): void {
	if (props.trigger !== 'hover') {
		return;
	}
	const related = event.relatedTarget as Element | null;
	if (isInsideAny(related)) {
		return;
	}

	if (showTimeout.value) {
		clearTimeout(showTimeout.value);
		showTimeout.value = null;
	}

	hideTimeout.value = setTimeout(() => {
		isVisible.value = false;
		emits('mouseleave');
		hideTimeout.value = null;
	}, props.hideDelayMs);
}

defineExpose({ isVisible, handleClick });
</script>

<template>
	<div
		ref="wrapper"
		@mouseenter="handleMouseover"
		@mouseleave="handleMouseleave"
	>
		<div
			ref="reference"
			@click="handleClick"
		>
			<slot
				name="default"
				:is-visible="isVisible"
			/>
		</div>
		<teleport :to="props.teleport" :disabled="!props.teleport">
			<transition name="fade">
				<div
					v-show="isVisible"
					ref="floating"
					:style="enhancedFloatingStyles"
					class="floating-content"
					:data-level="currentLevel"
					@mouseenter="handleFloatingMouseenter"
					@mouseleave="handleFloatingMouseleave"
				>
					<div class="floating-inner" :style="{padding:`${props.positionOffset}px`}">
						<div class="floating-scroll-wrapper">
							<slot name="content" />
						</div>
					</div>
				</div>
			</transition>
		</teleport>
	</div>
</template>

<style scoped>
.floating-content {
	z-index: v-bind('101 + currentLevel');
}

.floating-scroll-wrapper {
	max-height: 80svh;
	overflow-y: auto;
}

.floating-inner {
	border-radius: 6px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
