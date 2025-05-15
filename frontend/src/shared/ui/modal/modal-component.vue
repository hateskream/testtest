<script setup lang="ts">
import { computed, watch, ref, onBeforeUnmount, useCssModule } from 'vue';

import { lockFocus, unlockFocus } from './focus-lock';

enum KeyboardKeys {
	Esc = 'Escape',
	Tab = 'Tab',
	Enter = 'Enter',
	ArrowUp = 'ArrowUp',
	ArrowDown = 'ArrowDown',
	ArrowRight = 'ArrowRight',
	ArrowLeft = 'ArrowLeft',
	Space = 'Space',
	Backspace = 'Backspace',
}

const FOCUSABLE_ELEMENTS = [
	'a[href]',
	'area[href]',
	'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
	'select:not([disabled]):not([aria-hidden])',
	'textarea:not([disabled]):not([aria-hidden])',
	'button:not([disabled]):not([aria-hidden])',
	'iframe',
	'object',
	'embed',
	'[contenteditable]',
	'[tabindex]:not([tabindex^="-"])',
];

type ModalPosition = 'right' | 'center' | 'left' | 'top';

interface IUiModalProps {
  modelValue: boolean;
  zIndex?: number;
  bodyScrollLock?: boolean;
  focusFirstElement?: boolean;
  closable?: boolean;
  position?: ModalPosition;
  maxWidth?: string;
  maxHeight?: string;
	isNotFullShield?: boolean;
}

const props = withDefaults(defineProps<IUiModalProps>(), {
	zIndex: 10002,
	bodyScrollLock: true,
	focusFirstElement: true,
	closable: false,
	position: 'center',
	maxWidth: 'max-content',
	maxHeight: 'none',
	isNotFullShield: false,
});

const emit = defineEmits({
	'update:modelValue': (value: boolean) => typeof value === 'boolean',
	'drop-success': () => true,
});

const classes = useCssModule('classes');

let activeElement: HTMLElement | null = null;
const isLockedFocus = ref(false);
const isModalScrollEnabled = ref(false);

const bodyWrapper = ref<HTMLDivElement | null>(null);

const classList = computed(() => ({
	[classes.scroll]: isModalScrollEnabled.value,
	[classes.right]: props.position === 'right',
	[classes.left]: props.position === 'left',
	[classes.center]: props.position === 'center',
	[classes.top]: props.position === 'top',
}));

const styles = computed(() => ({
	maxWidth: props.maxWidth,
	maxHeight: props.maxHeight,
}));

onBeforeUnmount(() => {
	enableBodyScroll();

	if (isLockedFocus.value && bodyWrapper.value) {
		unlockFocus(bodyWrapper.value as HTMLElement);
	}
});

watch(
	() => props.modelValue,
	(value: boolean) => {
		if (value) {
			onOpened();
		} else {
			onClosed();
		}
	},
);

function onOpened(): void {
	document.addEventListener('keydown', onKeydown);
	disableBodyScroll();

	setTimeout(() => {
		turnLockFocus();

		if (bodyWrapper.value) {
			isModalScrollEnabled.value = bodyWrapper.value.scrollHeight > bodyWrapper.value.clientHeight;
		}

		if (props.focusFirstElement) {
			setFocusToFirstNode();
		} else if (activeElement && (activeElement as HTMLElement).focus) {
			(activeElement as HTMLElement).blur();
		}
	});
}

function onClosed(): void {
	document.removeEventListener('keydown', onKeydown);
	turnUnlockFocus();
	enableBodyScroll();
}

function turnLockFocus(): void {
	if (isLockedFocus.value) {
		return;
	}

	activeElement = document.activeElement as HTMLElement;
	lockFocus(bodyWrapper.value as HTMLElement);

	isLockedFocus.value = true;
}

function turnUnlockFocus(): void {
	if (!isLockedFocus.value) {
		return;
	}

	unlockFocus(bodyWrapper.value as HTMLElement);
	activeElement?.focus();
	activeElement = null;

	isLockedFocus.value = false;
}

function disableBodyScroll(): void {
	if (props.bodyScrollLock) {
		document.body.style.overflow = 'hidden';
	}
}

function enableBodyScroll(): void {
	if (props.bodyScrollLock) {
		document.body.style.overflow = '';
	}
}

function getFocusableNodes(): (Element | HTMLElement)[] {
	const nodes = bodyWrapper.value?.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')) || [];
	return Array(...nodes);
}

function setFocusToFirstNode(): void {
	const focusableNodes = getFocusableNodes();

	if (!focusableNodes.length) {
		return;
	}

	(focusableNodes[0] as HTMLElement).focus();
}

function onKeydown(event: KeyboardEvent): void {
	if (event.key === KeyboardKeys.Esc) {
		closeModal();
	}
}

function closeModal(): void {
	emit('update:modelValue', false);
}

function handleDrop(event: DragEvent) {
	event.preventDefault();
	// Logic to handle drop (e.g., validate drop target, update state)
	// Assuming drop is valid, emit or call a function to mark drop as successful
	emit('drop-success'); // Emit event to parent or call onDropSuccess directly
}
</script>

<template>
	<transition :name="props.position">
		<div
			v-if="props.modelValue"
			:style="{ zIndex: props.zIndex }"
			:class="[classes.modal, classList]"
		>
			<div :class="classes.inner">
				<!-- <div
					:class="props.isNotFullShield ? classes.notFullShield : classes.fullShield"
					tabindex="-1"
					@click="closeModal"
				/>
				<div :class="classes.focusguard" tabindex="0" /> -->
				<div
					ref="rootDialog"
					:class="[classes.dialog, classes[props.position]]"
					role="dialog"
					aria-modal="true"
					:style="styles"
					@drop="handleDrop"
					@dragover.prevent
				>
					<div
						ref="bodyWrapper"
						:class="classes.body"
					>
						<slot />
					</div>
				</div>
				<div :class="classes.focusguard" tabindex="0" />
			</div>
		</div>
	</transition>
</template>

<style module="classes">
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.inner {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
}

.dialog {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin: auto;
}

.fullShield {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.notFullShield {
	position: fixed;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
}

.body {
	flex-grow: 1;
	width: 100%;
	overflow-y: auto;
}

.body::-webkit-scrollbar {
	width: 0;
}

.focusguard {
	position: fixed;
	top: 0;
	left: 0;
	display: block;
	width: 1px;
	height: 1px;
	opacity: 0;
	pointer-events: none;
}

.scroll .dialog {
	overflow-y: auto;
}

.right {
	position: fixed;
	right: 0;
	height: 100%;
}

.left {
	position: fixed;
	left: 0;
	height: 100%;
}

.center {
	justify-content: center;
	align-items: center;
}

.top {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	height: 100%;
}

.center-enter-active,
.center-leave-active,
.right-enter-active,
.right-leave-active,
.left-enter-active,
.left-leave-active,
.top-enter-active,
.top-leave-active {
	transition: opacity 0.2s ease-in-out;
	will-change: opacity;
}

.center-enter-active.dialog,
.center-leave-active.dialog,
.right-enter-active.dialog,
.right-leave-active.dialog,
.left-enter-active.dialog,
.left-leave-active.dialog,
.top-enter-active.dialog,
.top-leave-active.dialog {
	transition: transform 0.2s ease-in-out;
	will-change: transform;
}

.center-enter-from,
.center-leave-to {
	opacity: 0;
}

.center-enter-from.dialog,
.center-leave-to.dialog {
	transform: scale(0.85);
}

.right-enter-from,
.right-leave-to {
	opacity: 0;
}

.right-enter-from.dialog,
.right-leave-to.dialog {
	transform: translateX(100%);
}

.left-enter-from,
.left-leave-to {
	opacity: 0;
}

.left-enter-from.dialog,
.left-leave-to.dialog {
	transform: translateX(-100%);
}

.top-enter-from,
.top-leave-to {
	opacity: 0;
}

.top-enter-from.dialog,
.top-leave-to.dialog {
	transform: translateY(-100%);
}
</style>
