<script setup lang="ts">
import { computed, getCurrentInstance, ref, useCssModule, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { autoUpdate, flip, offset, shift, useFloating, type VirtualElement } from '@floating-ui/vue';

import { createResizeContext } from '../composables/use-resize-context';
import { useGlobalRcm } from '../composables/use-rcm';
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IBaseDashboardComponentProps {
	isResizing: boolean;
}

const props = defineProps<IBaseDashboardComponentProps>();

createResizeContext(props.isResizing);

const classes = useCssModule('classes');

const instanceId = getCurrentInstance()!.uid;
const { isOpen: isVisibleRcm, open: openRcm, close: closeRcm } = useGlobalRcm(instanceId);

const rcmRef = useTemplateRef('rcm');

const reference = ref<VirtualElement | null>(null);
const { floatingStyles } = useFloating(reference, rcmRef, {
	placement: 'right-start',
	strategy: 'fixed',
	middleware: [offset(6), flip(), shift({ padding: 5 })],
	whileElementsMounted: autoUpdate,
});

const classList = computed(() => ({
	[classes.resizing]: props.isResizing,
	[classes.notResizing]: !props.isResizing,
}));

onClickOutside(rcmRef, () => {
	closeRcm();
});

function handleOpenRcm(e: MouseEvent) {
	reference.value = {
		getBoundingClientRect() {
			return {
				width: 0,
				height: 0,
				x: e.clientX,
				y: e.clientY,
				top: e.clientY,
				left: e.clientX,
				right: e.clientX,
				bottom: e.clientY,
			};
		},
	};

	openRcm();
}
</script>

<template>
	<div :class="[classes.container, classList]" @click.prevent.right="handleOpenRcm">
		<div :class="[classes.title, 'widget-drag']">
			<div :class="classes.titleTextContainer">
				<div :class="classes.titleText">
					<slot name="title" />
				</div>
			</div>
			<div :class="classes.control">
				<ui-icon
					:id="IconIds.ControlMore"
					:class="classes.iconWrapper"
					width="20px"
					height="20px"
					@click.prevent.left="handleOpenRcm"
				/>
			</div>
		</div>
		<div :class="[classes.content, 'widget-no-drag']">
			<slot name="content" />
		</div>
		<teleport to="body">
			<div
				v-show="isVisibleRcm"
				ref="rcm"
				:class="classes.rcm"
				:style="floatingStyles"
			>
				<slot name="rcm" />
			</div>
		</teleport>
	</div>
</template>

<style module="classes">
.iconWrapper {
	color: var(--icon-color-base-300);
	cursor: pointer;
}

.resizing {
	background-color: var(--bg-color-surface-02);
}

.notResizing {
	background-color: var(--bg-color-surface-01);
}

.container {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	border-radius: 18px;
}

.title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 8px 10px 16px;
	color: var(--text-color-base-300);
}

.titleTextContainer {
	overflow: hidden;
	font-weight: 300;
	font-size: 16px;
	color: var(--text-color-base-300);
	letter-spacing: 0.104px;
}

.titleText {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.content {
	flex: 1;
	overflow: hidden;
}

.control {
	display: flex;
	align-items: center;
	gap: 26px;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.container:hover > .title > .control {
	opacity: 1;
}

.rcm {
	z-index: 101;
}
</style>
