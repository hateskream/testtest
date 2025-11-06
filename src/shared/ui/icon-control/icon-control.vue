<script setup lang="ts">
import { type CSSProperties } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IUiIconControlProps {
	icon?: IconIds;
	iconSize?: CSSProperties['width'];
	size?: CSSProperties['width'];
}

const props = withDefaults(defineProps<IUiIconControlProps>(), {
	icon: IconIds.Plus,
	iconSize: '8px',
	size: '20px',
});

</script>

<template>
	<div :class="classes.control">
		<slot name="icon" :icon-size="props.iconSize">
			<ui-icon
				v-if="props.icon"
				:id="props.icon"
				:width="iconSize"
				:height="iconSize"
				:class="classes.icon"
			/>
		</slot>
	</div>
</template>

<style module="classes">
.control {
	display: flex;
	justify-content: center;
	align-items: center;
	width: v-bind(props.size);
	height: v-bind(props.size);
	background-color: var(--icon-color-base-300);
	border-radius: 50%;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: var(--icon-color-base-300-effect);
	}
}

.icon {
	color: #000000;
}
</style>
