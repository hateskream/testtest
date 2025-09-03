<script setup lang="ts">
import { offset, shift, useFloating, flip, autoUpdate, type Placement } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';
import { ref, useTemplateRef } from 'vue';

interface IPositionComponentProps {
	position?: Placement;
	trigger?: 'hover' | 'click';
	showInMs?: number;
	positionOffset?: number;
	strategy?: 'fixed' | 'absolute';
}

interface IPositionComponentEmits {
	(e: 'mouseover'): void;
	(e: 'mouseleave'): void;
}

const props = withDefaults(defineProps<IPositionComponentProps>(), {
	position: 'right-end',
	trigger: 'click',
	showInMs: 100,
	positionOffset: 6,
	strategy: 'fixed',
});

const emits = defineEmits<IPositionComponentEmits>();

const reference = useTemplateRef('reference');
const floating = useTemplateRef('floating');
const wrapper = useTemplateRef('wrapper');

const { floatingStyles } = useFloating(reference, floating, {
	strategy: props.strategy,
	placement: props.position,
	middleware: [offset(props.positionOffset), flip(), shift({ padding: 5 })],
	whileElementsMounted: autoUpdate,
});

const isVisible = ref(false);

const timeout = ref<number | null>(null);

onClickOutside(wrapper, () => {
	if (props.trigger === 'click') {
		isVisible.value = false;
	}
});

function handleClick() {
	if (props.trigger === 'click') {
		isVisible.value = !isVisible.value;
	}
}

function handleMouseover() {
	if (props.trigger === 'hover') {
		if (timeout.value) {
			return;
		}

		timeout.value = setTimeout(() => {
			isVisible.value = true;

			emits('mouseover');
		}, props.showInMs);
	}
}

function handleMouseleave() {
	if (props.trigger === 'hover') {
		if (timeout.value) {
			clearTimeout(timeout.value);

			timeout.value = null;

			isVisible.value = false;
			emits('mouseleave');
		}
	}
}
defineExpose({ isVisible, handleClick });
</script>

<template>
	<div
		ref="wrapper"
		:class="classes.wrapper"
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
		<transition name="fade">
			<div
				v-show="isVisible"
				ref="floating"
				:class="classes.content"
				:style="floatingStyles"
			>
				<slot name="content" />
			</div>
		</transition>
	</div>
</template>

<style module="classes">
.content {
	z-index: 101;
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
