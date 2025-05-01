<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { onClickOutside, useMouseInElement } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { IModalRcmPositions } from '../../modal/model';

const target = useTemplateRef('target');
const isVisibleRcm = ref(false);
const mousePositions = useMouseInElement(target);
const rcmPositions = ref<IModalRcmPositions>({
	x: 0,
	y: 0,
});

function handleOpenRcm() {
	rcmPositions.value = {
		x: mousePositions.elementX.value,
		y: mousePositions.elementY.value,
	};
	isVisibleRcm.value = true;
}

const rcmRef = useTemplateRef('rcm');

onClickOutside(rcmRef, () => {
	isVisibleRcm.value = false;
});
</script>

<template>
	<div
		ref="target"
		:class="classes.container"
	>
		<div
			:class="classes.title"
			@click.prevent.right="handleOpenRcm"
		>
			<div :class="classes.titleText">
				<slot name="title" />
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
		<div :class="classes.content">
			<slot name="content" />
		</div>
		<div
			v-show="isVisibleRcm"
			ref="rcm"
			:class="classes.rcm"
		>
			<slot
				name="rcm"
				:positions="rcmPositions"
			/>
		</div>
	</div>
</template>

<style module="classes">
.iconWrapper {
	color: var(--icon-color-base-300);
	cursor: pointer;
}

.container {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
	background-color: var(--bg-color-surface-01);
	border-radius: 18px;
}

.title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 8px 10px 16px;
	color: var(--text-color-base-300);
}

.titleText {
	font-weight: 300;
	font-size: 16px;
	line-height: 140%;
	color: var(--text-color-base-300);
	letter-spacing: 0.104px;
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
	position: absolute;
	z-index: 101;
}
</style>
