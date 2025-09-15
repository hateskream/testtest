<script setup lang="ts">
import { offset, shift, useFloating, flip, autoUpdate, type Placement } from '@floating-ui/vue';
import { ref, useTemplateRef, provide, inject, onMounted, onUnmounted, computed } from 'vue';

interface IPositionComponentProps {
	position?: Placement;
	trigger?: 'hover' | 'click';
	showInMs?: number;
	hideDelayMs?: number;
	positionOffset?: number;
	strategy?: 'fixed' | 'absolute';
	hoverPadding?: number;
}

interface IPositionComponentEmits {
	(e: 'mouseover'): void;

	(e: 'mouseleave'): void;
}

interface IFloatingContext {
	registerFloating: (element: HTMLElement) => void;
	unregisterFloating: (element: HTMLElement) => void;
	isInsideFloating: (target: Element) => boolean;
}

const props = withDefaults(defineProps<IPositionComponentProps>(), {
	position: 'right-end',
	trigger: 'click',
	showInMs: 100,
	hideDelayMs: 200,
	positionOffset: 2,
	strategy: 'fixed',
	hoverPadding: 8,
});

const emits = defineEmits<IPositionComponentEmits>();

const reference = useTemplateRef('reference');
const floating = useTemplateRef('floating');
const wrapper = useTemplateRef('wrapper');

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

const isVisible = ref(false);
const showTimeout = ref<number | null>(null);
const hideTimeout = ref<number | null>(null);

const parentContext = inject<IFloatingContext | null>('floating-context', null);
const floatingElements = ref(new Set<HTMLElement>());

const context: IFloatingContext = {
	registerFloating: (element: HTMLElement) => {
		floatingElements.value.add(element);
		parentContext?.registerFloating(element);
	},
	unregisterFloating: (element: HTMLElement) => {
		floatingElements.value.delete(element);
		parentContext?.unregisterFloating(element);
	},
	isInsideFloating: (target: Element): boolean => {
		for (const element of floatingElements.value) {
			if (element.contains(target)) {
				return true;
			}
		}
		return parentContext?.isInsideFloating(target) ?? false;
	},
};

provide('floating-context', context);

const enhancedFloatingStyles = computed(() => {
	if (!floatingStyles.value) {
		return {};
	}

	const baseStyles = floatingStyles.value;

	if (props.trigger === 'hover') {
		const padding = props.hoverPadding;
		let paddingStyle = {};

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
	const observer = new MutationObserver(() => {
		if (floating.value && !floatingElements.value.has(floating.value)) {
			context.registerFloating(floating.value);
		}
	});

	if (floating.value) {
		context.registerFloating(floating.value);
	}

	observer.observe(document.body, { childList: true, subtree: true });

	onUnmounted(() => {
		observer.disconnect();
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

const handleDocumentClick = (event: Event) => {
	if (props.trigger !== 'click') {
		return;
	}

	const target = event.target as Element;

	if (wrapper.value?.contains(target)) {
		return;
	}

	if (context.isInsideFloating(target)) {
		return;
	}

	isVisible.value = false;
};

const setupClickOutside = () => {
	document.addEventListener('click', handleDocumentClick, true);
};

const cleanupClickOutside = () => {
	document.removeEventListener('click', handleDocumentClick, true);
};

onMounted(setupClickOutside);
onUnmounted(cleanupClickOutside);

function handleClick() {
	if (props.trigger === 'click') {
		isVisible.value = !isVisible.value;
	}
}

function handleMouseover() {
	if (props.trigger === 'hover') {
		if (hideTimeout.value) {
			clearTimeout(hideTimeout.value);
			hideTimeout.value = null;
		}

		if (isVisible.value) {
			return;
		}

		if (showTimeout.value) {
			return;
		}

		showTimeout.value = setTimeout(() => {
			isVisible.value = true;
			emits('mouseover');
			showTimeout.value = null;
		}, props.showInMs);
	}
}

function handleMouseleave() {
	if (props.trigger === 'hover') {
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
}

defineExpose({ isVisible, handleClick });
</script>

<template>
	<div
		ref="wrapper"
		@mouseover="handleMouseover"
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
		<teleport to="body">
			<transition name="fade">
				<div
					v-show="isVisible"
					ref="floating"
					:style="enhancedFloatingStyles"
					class="floating-content"
					@mouseover="handleMouseover"
					@mouseleave="handleMouseleave"
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
	z-index: 101;
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
