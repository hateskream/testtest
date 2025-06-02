<script setup lang="ts">
import { computed, provide, ref, useCssModule, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';
import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
	type VirtualElement,
} from '@floating-ui/vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IBaseDashboardComponentProps {
	isResizing: boolean;
}

const props = defineProps<IBaseDashboardComponentProps>();

provide('isResize', props.isResizing);


const classes = useCssModule('classes');

const isVisibleRcm = ref(false);
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
	isVisibleRcm.value = false;
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

	isVisibleRcm.value = true;
}
</script>

<template>
	<div :class="[classes.container, classList]">
		<div
			:class="[classes.title, 'widget-drag']"
			@click.prevent.right="handleOpenRcm"
		>
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
				/>
				<ui-icon
					:id="IconIds.ControlShare"
					:class="classes.iconWrapper"
					width="20px"
					height="20px"
				/>
			</div>
		</div>
		<div :class="[classes.content, 'widget-no-drag']">
			<slot name="content" />
		</div>
		<div
			v-show="isVisibleRcm"
			ref="rcm"
			:class="classes.rcm"
			:style="floatingStyles"
		>
			<slot name="rcm" />
		</div>
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

.title:hover > .control {
	opacity: 1;
}

.rcm {
	z-index: 101;
}
</style>
