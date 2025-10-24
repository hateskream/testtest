<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

import type { IPositionProps } from './model';
import { matchesTrigger } from '@/app/plugins/floating/utils';

interface IPositionComponentEmits {
	(e: 'mouseover'): void;
	(e: 'mouseleave'): void;
}

const props = withDefaults(defineProps<IPositionProps>(), {
	position: 'right-end',
	trigger: 'hover',
	showInMs: 100,
	hideDelayMs: 200,
	positionOffset: 6,
	strategy: 'fixed',
	hoverPadding: 8,
});

const emits = defineEmits<IPositionComponentEmits>();

const reference = useTemplateRef<HTMLElement>('reference');
const floating = useTemplateRef<HTMLElement>('floating');
const wrapper = useTemplateRef<HTMLElement>('wrapper');

const { floatingStyles, placement } = useFloating(reference, floating, {
	strategy: props.strategy,
	placement: props.position,
	middleware: [offset(props.positionOffset - 2), flip(), shift({ padding: 5 })],
	whileElementsMounted: autoUpdate,
});

const isVisible = ref(false);

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
	isVisible.value = !isVisible.value;
}

function isInsideAny(target: Element | null) {
	if (!target) {
		return false;
	}
	return !!target.closest('[data-floating-submenu]');
}

function handleMouseover(e: MouseEvent) {
	e.stopPropagation();

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

function handleMouseleave(e: MouseEvent) {
	const related = e.relatedTarget as Element | null;
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

function handleFloatingMouseenter() {
	if (matchesTrigger(props.trigger, 'hover') && hideTimeout.value) {
		clearTimeout(hideTimeout.value);
		hideTimeout.value = null;
	}
}

function handleFloatingMouseleave(e: MouseEvent) {
	const related = e.relatedTarget as Element | null;
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

const handleDocumentClick = (event: Event) => {
	const target = event.target as Element;
	if (wrapper.value?.contains(target)) {
		return;
	}
	if (floating.value?.contains(target)) {
		return;
	}
	isVisible.value = false;
};

onMounted(() => {
	const el = wrapper.value;
	const content = floating.value;
	if (!el || !content) {
		return;
	}
	const { trigger } = props;

	if (matchesTrigger(trigger, 'contextmenu')) {
		el.addEventListener('contextmenu', handleClick);
	}

	if (matchesTrigger(trigger, 'click')) {
		el.addEventListener('click', handleClick);
	}

	if (matchesTrigger(trigger, 'hover')) {
		el.addEventListener('mouseenter', handleMouseover);
		el.addEventListener('mouseleave', handleMouseleave);

		content.addEventListener('mouseenter', handleFloatingMouseenter);
		content.addEventListener('mouseleave', handleFloatingMouseleave);
	}

	document.addEventListener('click', handleDocumentClick, true);

	onUnmounted(() => {
		el.removeEventListener('contextmenu', handleClick);
		el.removeEventListener('click', handleClick);
		el.removeEventListener('mouseenter', handleMouseover);
		el.removeEventListener('mouseleave', handleMouseleave);

		content.removeEventListener('mouseenter', handleFloatingMouseenter);
		content.removeEventListener('mouseleave', handleFloatingMouseleave);

		document.removeEventListener('click', handleDocumentClick, true);
	});
});

defineExpose({ isVisible, handleClick });
</script>

<template>
	<div ref="wrapper">
		<div
			ref="reference"
			@click="handleClick"
		>
			<slot
				name="title"
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
					data-floating-submenu
				>
					<div class="floating-inner" :style="{ padding: `${props.positionOffset}px` }">
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
