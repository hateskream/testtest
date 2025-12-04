<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPillItem } from '@/shared/ui/pill';

const emits = defineEmits(['reset']);
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.icon">
			<ui-icon
				:id="IconIds.EventBoardEmpty"
				width="75px"
				height="55px"
			/>
			<ui-icon
				:id="IconIds.Ellipse"
				:class="classes.ellipse"
				width="200px"
				height="200px"
			/>
		</div>
		<p :class="classes.paragraph">
			Nothing Here
		</p>
		<ui-pill-item :class="classes.butt" @click="emits('reset')">
			Reset filters
		</ui-pill-item>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	justify-content: center;
	gap: 12px;
	align-items: center;
	width: 100%;
	height: 100%;
	background: var(--color-bg-surface-01, #0c0c0d);
	border-radius: 18px;
}

.icon {
	position: relative;
}

.ellipse {
	position: absolute;
	top: 50%;
	left: 50%;
	flex-shrink: 0;
	transform: translate(-50%, -50%);
	filter: blur(13px);
	fill: rgb(255 255 255 / 16%);
	pointer-events: none;
}

.paragraph {
	font-style: normal;
	font-weight: 300;
	font-size: var(--typography-headers-size-h-01, 16px);
	line-height: 1;
	text-align: center;
	color: var(--color-text-base-500, #ffffff);
	letter-spacing: 0.104px;
}

.butt {
	font-style: normal;
	font-weight: 380;
	font-size: var(--typography-headers-size-h-02, 12px);
	line-height: 1;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.04px;
	cursor: pointer;

	&:hover {
		color: #ffffff;
		background: rgb(51 51 51 / 80%);
	}
}
</style>
