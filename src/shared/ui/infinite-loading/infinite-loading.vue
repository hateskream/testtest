<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, useTemplateRef } from 'vue';

import { type IInfiniteStateHandler, State } from './model.ts';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { IconIds, UiIcon } from '@/shared/ui/icon';

const emit = defineEmits<{ infinite: [state: IInfiniteStateHandler] }>();

interface IInfiniteLoadingProps {
	top?: boolean;
	scroller?: HTMLElement | string;
	distance?: number;
	firstLoad?: boolean;
}

const props = withDefaults(defineProps<IInfiniteLoadingProps>(), {
	firstLoad: true,
	distance: 0,
	scroller: () => document.documentElement,
});

let observer: IntersectionObserver | null = null;

const hasFirstLoad = ref(props.firstLoad);

const infiniteLoading = useTemplateRef('infiniteLoading');
const state = ref<State>(State.Idle);

const parentElement = shallowRef<HTMLElement | null>(null);

const stateHandler: IInfiniteStateHandler = {
	loading() {
		state.value = State.Loading;
	},
	async loaded() {
		state.value = State.Loaded;

		if (isVisible(infiniteLoading.value!, parentElement.value)) {
			load();
		}
	},
	async complete() {
		state.value = State.Complete;
		observer?.disconnect();
	},
	error() {
		state.value = State.Error;
	},
};

function isVisible(el: Element, view: Element | null = null): boolean {
	if (!el) {
		return false;
	}

	const elRect = el.getBoundingClientRect();

	const viewRect = view
		? view.getBoundingClientRect()
		: { top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth };

	return (
		elRect.bottom >= viewRect.top &&
		elRect.top <= viewRect.bottom &&
		elRect.right >= viewRect.left &&
		elRect.left <= viewRect.right
	);
}

function load() {
	stateHandler.loading();
	emit('infinite', stateHandler);
}

function startObserver() {
	const rootMargin = props.top ?
		`${props.distance}px 0px 0px 0px` :
		`0px 0px ${props.distance}px 0px`;

	const obs = new IntersectionObserver(
		entries => {
			if (entries[0].isIntersecting) {
				if (hasFirstLoad.value) {
					load();
				}

				hasFirstLoad.value = true;
			}
		},
		{ root: parentElement.value, rootMargin },
	);

	if (infiniteLoading.value) {
		obs.observe(infiniteLoading.value);
	}

	return obs;
}

function resetObserver() {
	observer?.disconnect();
	observer = startObserver();
}

onMounted(() => {
	nextTick(() => {
		parentElement.value = props.scroller instanceof HTMLElement ?
			props.scroller :
			document.querySelector(props.scroller);

		resetObserver();
	});
});

onUnmounted(() => observer?.disconnect());

const isLoadingState = computed(() => state.value === State.Loading);
const isCompleteState = computed(() => state.value === State.Complete);
const isErrorState = computed(() => state.value === State.Error);
</script>

<template>
	<div ref="infiniteLoading" :class="classes.root">
		<div v-show="isLoadingState">
			<slot name="loader">
				<ui-skeleton
					width="100%"
					height="24px"
					border-radius="8px"
				/>
			</slot>
		</div>
		<slot v-if="isCompleteState" name="complete"></slot>
		<slot
			v-if="isErrorState"
			name="error"
			:retry="load"
		>
			<div :class="classes.errorContainer">
				<div :class="classes.errorContent">
					<p>Couldn't load</p>
					<div
						:class="classes.narrowContent"
						@click="load"
					>
						<span :class="classes.retryContainer">
							<ui-icon
								:id="IconIds.Retry"
								:class="classes.icon"
								width="20px"
								height="20px"
							/>
							<span :class="classes.retryText"> Retry </span>
						</span>
						<button :class="classes.retryButton">R</button>
					</div>
				</div>
			</div>
		</slot>
	</div>
</template>

<style module="classes">
.root {
	width: 100%;
	min-height: 1px;
}

.errorContainer {
	display: flex;
	justify-content: center;
	padding: 6px 0;
}

.errorContent {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: fit-content;
	padding: 8px 32px;
	color: var(--text-color-base-100);
	background-color: var(--bg-color-base-100);
	border-radius: 28px;
}

.narrowContent {
	display: flex;
	align-items: center;
	gap: 8px;
}

.retryContainer {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
}

.retryText {
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
	color: var(--text-color-base-300);
}

.retryButton {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	font-weight: 500;
	font-size: 14px;
	color: var(--text-color-base-100);
	background-color: var(--bg-color-base-300);
	border-radius: 6px;
	cursor: pointer;
}
</style>
