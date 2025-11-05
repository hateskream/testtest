import type { Ref } from 'vue';
import { defaultWindow } from '@vueuse/core';
import { isClient } from '@vueuse/shared';
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';

import { useStateMachine } from './composables/use-state-machine.ts';
import { getAnimationName } from './utils/get-animation-name.ts';


export function usePresence(
	present: Ref<boolean>,
	node: Ref<HTMLElement | undefined>,
) {
	const stylesRef = ref<Partial<CSSStyleDeclaration>>({});
	const prevAnimationNameRef = ref<string>('none');
	const prevPresentRef = ref(present);
	const initialState = present.value ? 'mounted' : 'unmounted';
	let timeoutId: number | undefined;
	const ownerWindow = node.value?.ownerDocument.defaultView ?? defaultWindow;

	const { state, dispatch } = useStateMachine(initialState, {
		mounted: {
			UNMOUNT: 'unmounted',
			ANIMATION_OUT: 'unmountSuspended',
		},
		unmountSuspended: {
			MOUNT: 'mounted',
			ANIMATION_END: 'unmounted',
		},
		unmounted: {
			MOUNT: 'mounted',
		},
	});

	const dispatchCustomEvent = (name: 'enter' | 'after-enter' | 'leave' | 'after-leave') => {
		if (isClient) {
			const customEvent = new CustomEvent(name, { bubbles: false, cancelable: false });
			node.value?.dispatchEvent(customEvent);
		}
	};

	watch(
		present,
		async (currentPresent, prevPresent) => {
			const hasPresentChanged = prevPresent !== currentPresent;
			await nextTick();
			if (hasPresentChanged) {
				const prevAnimationName = prevAnimationNameRef.value;
				const currentAnimationName = getAnimationName(node.value);

				if (currentPresent) {
					dispatch('MOUNT');
					dispatchCustomEvent('enter');
					if (currentAnimationName === 'none') {
						dispatchCustomEvent('after-enter');
					}
				} else if (
					currentAnimationName === 'none' || currentAnimationName === 'undefined'
					|| stylesRef.value?.display === 'none'
				) {
					dispatch('UNMOUNT');
					dispatchCustomEvent('leave');
					dispatchCustomEvent('after-leave');
				} else {
					const isAnimating = prevAnimationName !== currentAnimationName;
					if (prevPresent && isAnimating) {
						dispatch('ANIMATION_OUT');
						dispatchCustomEvent('leave');
					} else {
						dispatch('UNMOUNT');
						dispatchCustomEvent('after-leave');
					}
				}
			}
		},
		{ immediate: true },
	);

	const handleAnimationEnd = (event: AnimationEvent) => {
		const currentAnimationName = getAnimationName(node.value);
		const isCurrentAnimation = currentAnimationName.includes(
			CSS.escape(event.animationName),
		);
		const directionName = state.value === 'mounted' ? 'enter' : 'leave';
		if (event.target === node.value && isCurrentAnimation) {
			dispatchCustomEvent(`after-${directionName}`);
			dispatch('ANIMATION_END');

			if (!prevPresentRef.value) {
				const currentFillMode = node.value.style.animationFillMode;
				node.value.style.animationFillMode = 'forwards';

				timeoutId = ownerWindow?.setTimeout(() => {
					if (node.value?.style.animationFillMode === 'forwards') {
						node.value.style.animationFillMode = currentFillMode;
					}
				});
			}
		}
		if (event.target === node.value && currentAnimationName === 'none') {
			dispatch('ANIMATION_END');
		}
	};
	const handleAnimationStart = (event: AnimationEvent) => {
		if (event.target === node.value) {
			prevAnimationNameRef.value = getAnimationName(node.value);
		}
	};

	const watcher = watch(
		node,
		(newNode, oldNode) => {
			if (newNode) {
				stylesRef.value = getComputedStyle(newNode);
				newNode.addEventListener('animationstart', handleAnimationStart);
				newNode.addEventListener('animationcancel', handleAnimationEnd);
				newNode.addEventListener('animationend', handleAnimationEnd);
			} else {
				dispatch('ANIMATION_END');

				if (timeoutId !== undefined) {
					ownerWindow?.clearTimeout(timeoutId);
				}
				oldNode?.removeEventListener('animationstart', handleAnimationStart);
				oldNode?.removeEventListener('animationcancel', handleAnimationEnd);
				oldNode?.removeEventListener('animationend', handleAnimationEnd);
			}
		},
		{ immediate: true },
	);

	const stateWatcher = watch(state, () => {
		const currentAnimationName = getAnimationName(node.value);
		prevAnimationNameRef.value
			= state.value === 'mounted' ? currentAnimationName : 'none';
	});

	onUnmounted(() => {
		watcher();
		stateWatcher();
	});

	const isPresent = computed(() =>
		['mounted', 'unmountSuspended'].includes(state.value),
	);

	return {
		isPresent,
	};
}
