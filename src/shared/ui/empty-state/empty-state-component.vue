<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText, type TextToken } from '../text';

interface IEmptyStateProps {
	label?: string;
	textToken?: TextToken;
}

const props = withDefaults(defineProps<IEmptyStateProps>(),
	{
		label: 'Nothing Here',
		textToken: 'title-300',
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
		<ui-text :token="props.textToken" :class="classes.paragraph">
			<slot name="label">
				{{ props.label }}
			</slot>
		</ui-text>
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
</style>
