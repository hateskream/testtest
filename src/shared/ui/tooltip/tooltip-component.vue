<script setup lang="ts">
import { offset, shift, useFloating, flip, autoUpdate, type Placement } from '@floating-ui/vue';
import { ref, useTemplateRef } from 'vue';

interface IProps {
	forceHide?: boolean;
	showInMs?: number;
	position?: Placement;
}

const props = withDefaults(defineProps<IProps>(), {
	forceHide: false,
	showInMs: 800,
	position: 'bottom',
});

const reference = useTemplateRef('reference');
const floating = useTemplateRef('floating');

const { floatingStyles } = useFloating(reference, floating, {
	strategy: 'fixed',
	placement: props.position,
	middleware: [offset(6), flip(), shift({ padding: 5 })],
	whileElementsMounted: autoUpdate,
});

const isVisible = ref(false);
const timeout = ref<number | null>(null);

function handleMouseover() {
	if (timeout.value) {
		return;
	}

	timeout.value = setTimeout(() => {
		isVisible.value = true;
	}, props.showInMs);
}

function handleMouseleave() {
	if (timeout.value) {
		clearTimeout(timeout.value);

		timeout.value = null;

		isVisible.value = false;
	}
}
</script>

<template>
	<div>
		<div
			ref="reference"
			@mouseover="handleMouseover"
			@mouseleave="handleMouseleave"
		>
			<slot name="default" />
		</div>
		<transition name="fade">
			<div
				v-show="isVisible && !forceHide"
				ref="floating"
				:style="floatingStyles"
				:class="classes.content"
				class="content-anchor"
			>
				<slot name="content" />
			</div>
		</transition>
	</div>
</template>

<style module="classes">
.content {
	z-index: 100;
	width: max-content;
	padding: 4px 10px;
	font-size: 12px;
	color: var(--text-color-base-300);
	background: var(--bg-color-base-500);
	border: 1px solid var(--border-color-base-300);
	border-radius: 8px;
	backdrop-filter: blur(16px);
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
