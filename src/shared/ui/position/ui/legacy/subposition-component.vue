<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

import type { IFloatingOptions } from '../../model';
import { matchesTrigger } from '../../utils';
import { providePinnedLevel, useHoverEvents, usePinnedLevel, usePinnedStack } from '../../composables';

interface ISubpositionProps extends IFloatingOptions {
	hoverPadding?: number;
}

const props = withDefaults(defineProps<ISubpositionProps>(), {
	placement: 'right-end',
	trigger: 'hover',
	offset: 6,
	strategy: 'fixed',
	hoverPadding: 8,
	openDelay: 20,
	closeDelay: (_props) => {
		if (_props.trigger && matchesTrigger(_props.trigger, ['hover'])) {
			return 150;
		}

		return 0;
	},
});

const parentLevel = usePinnedLevel();
const level = providePinnedLevel(parentLevel + 1);

const wrapper = useTemplateRef<HTMLElement>('wrapper');
const reference = useTemplateRef<HTMLElement>('reference');
const floating = useTemplateRef<HTMLElement>('floating');

const isVisible = ref(false);
const isPinned = ref(false);

const stack = usePinnedStack();
let clearPinned: (() => void) | null = null;

function pin() {
	clearPinned = stack?.push(level, handleDocumentClick) ?? null;
}

function unpin() {
	clearPinned?.();
}

const { floatingStyles, placement } = useFloating(reference, floating, {
	strategy: props.strategy,
	placement: props.placement,
	middleware: [offset(props.offset - 2), flip(), shift({ padding: 5 })],
	whileElementsMounted: autoUpdate,
});

const {
	onMouseEnter: onMouseEnterHandler,
	onMouseLeave,
	onFloatingEnter,
	onFloatingLeave,
} = useHoverEvents({
	isPinned: isPinned,
	show: () => {
		if (!isVisible.value) {
			isVisible.value = true;
		}
	},
	hide: () => {
		if (!isPinned.value && isVisible.value) {
			isVisible.value = false;
		}
	},
	triggerRef: reference,
	openDelay: () => props.openDelay,
	closeDelay: () => props.closeDelay,
});

function onMouseEnter() {
	if (stack?.hasPinnedLevel(level)) {
		return;
	}

	onMouseEnterHandler();
}

function handleClick() {
	if (!matchesTrigger(props.trigger, 'hover')) {
		isVisible.value = !isVisible.value;
	}

	if (!isPinned.value) {
		isPinned.value = true;
		isVisible.value = true;
		pin();
	} else {
		isPinned.value = false;
		unpin();
	}
}

function handleDocumentClick() {
	isPinned.value = false;
	isVisible.value = false;
}

const enhancedFloatingStyles = computed(() => {
	const base = floatingStyles.value ?? {};

	if (!matchesTrigger(props.trigger, 'hover')) {
		return base;
	}

	const padding = props.hoverPadding;
	if (!placement.value) {
		return base;
	}

	if (placement.value.startsWith('right')) {
		return { ...base, paddingLeft: `${padding}px`, marginLeft: `-${padding}px` };
	}
	if (placement.value.startsWith('left')) {
		return { ...base, paddingRight: `${padding}px`, marginRight: `-${padding}px` };
	}
	if (placement.value.startsWith('top')) {
		return { ...base, paddingBottom: `${padding}px`, marginBottom: `-${padding}px` };
	}
	if (placement.value.startsWith('bottom')) {
		return { ...base, paddingTop: `${padding}px`, marginTop: `-${padding}px` };
	}

	return base;
});

onMounted(() => {
	const wrapperEl = wrapper.value;
	const triggerEl = reference.value;

	if (!wrapperEl || !triggerEl) {
		return;
	}

	triggerEl.addEventListener('click', handleClick);

	if (matchesTrigger(props.trigger, 'contextmenu')) {
		wrapperEl.addEventListener('contextmenu', handleClick);
	}

	if (matchesTrigger(props.trigger, 'hover')) {
		wrapperEl.addEventListener('mouseenter', onMouseEnter);
		wrapperEl.addEventListener('mouseleave', onMouseLeave);

		floating.value?.addEventListener('mouseenter', onFloatingEnter, true);
		floating.value?.addEventListener('mouseleave', onFloatingLeave, true);
	}

	onUnmounted(() => {
		triggerEl.removeEventListener('click', handleClick);

		if (matchesTrigger(props.trigger, 'contextmenu')) {
			wrapperEl.removeEventListener('contextmenu', handleClick);
		}

		if (matchesTrigger(props.trigger, 'hover')) {
			wrapperEl.removeEventListener('mouseenter', onMouseEnter);
			wrapperEl.removeEventListener('mouseleave', onMouseLeave);
			floating.value?.removeEventListener('mouseenter', onFloatingEnter, true);
			floating.value?.removeEventListener('mouseleave', onFloatingLeave, true);
		}
	});
});

defineExpose({ isVisible, isPinned, handleClick });
</script>

<template>
	<div
		ref="wrapper"
		data-subposition
		:data-position-level="level"
	>
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
