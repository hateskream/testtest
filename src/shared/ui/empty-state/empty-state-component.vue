<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IEmptyStateProps {
	label?: string;
}

const props = withDefaults(defineProps<IEmptyStateProps>(),
	{
		label: 'Nothing Here',
	},
);
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
			<slot name="label">
				{{ props.label }}
			</slot>
		</p>
		<slot name="footer"></slot>
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
	background: var(--bg-color-surface-01);
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
	font-size: var(--typography-headers-size-h01);
	line-height: 1;
	text-align: center;
	color: var(--text-color-base-500);
	letter-spacing: 0.104px;
}
</style>
