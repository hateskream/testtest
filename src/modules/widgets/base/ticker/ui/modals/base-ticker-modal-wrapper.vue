<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';

import { PositionTeleport } from '@/shared/ui/position';
import { UiPresence } from '@/shared/ui/presence';

const model = defineModel<boolean>({
	required: true,
});

function onKeydown(event: KeyboardEvent): void {
	if (event.key === 'Escape') {
		model.value = false;
	}
}

watch(model, (isOpen) => {
	if (isOpen) {
		window.addEventListener('keydown', onKeydown);
	} else {
		window.removeEventListener('keydown', onKeydown);
	}
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', onKeydown);
});

defineOptions({
	inheritsAttrs: false,
});
</script>

<template>
	<position-teleport>
		<ui-presence :state="model" v-slot="{ present }">
			<transition name="modal">
				<div
					v-if="present"
					:class="classes.bg"
					@click.self="model = false"
				>
					<div
						:class="[classes.wrapper, 'modal-content']"
						v-bind="$attrs"
					>
						<slot />
					</div>
				</div>
			</transition>
		</ui-presence>
	</position-teleport>
</template>

<style module="classes">
.bg {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background: var(--atom-dark-30, rgb(5 5 5 / 70%));
	gap: 4px;
}

.wrapper {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	align-items: center;
	max-height: 80svh;
	margin: var(--padding-s12, 24px) var(--padding-s6, 18px);
	overflow: hidden;
	background: var(--surface-modal, rgb(30 30 32 / 88%));
	border: 1px solid var(--border-surf-04, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s20-72, 28.4px);
	backdrop-filter: blur(9px);
}
</style>

<style>
.modal-enter-active,
.modal-leave-active {
	transition: opacity 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-active .modal-content {
	transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-leave-active .modal-content {
	transition: transform 160ms ease-in;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
	transform: scale(0.96) translateY(6px);
}
</style>
