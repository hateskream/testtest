<script setup lang="ts">
import { computed } from 'vue';

import { UiText } from '@/shared/ui/text';
import { UiClamped } from '../clamped';
import type { TextToken } from '@/shared/ui/text/token';
import { UiIcon, type IconIds } from '@/shared/ui/icon';

const props = defineProps<{
	token: 'm-24' | 'm-24-bg' | 'l-24-bg';
	iconId?: IconIds;
}>();

const textToken = computed<TextToken>(() => {
	if (props.token === 'm-24') {
		return 'text-300-b';
	}

	if (props.token === 'm-24-bg') {
		return 'text-300-r';
	}

	if (props.token === 'l-24-bg') {
		return 'text-400-r';
	}

	return 'text-300-r';
});
</script>

<template>
	<button :class="[classes.control, classes[props.token]]">
		<ui-icon
			v-if="props.iconId"
			:id="props.iconId"
			:class="classes.icon"
			width="16px"
			height="16px"
		/>
		<ui-clamped :rows="1">
			<ui-text :token="textToken" :class="classes.text">
				<slot />
			</ui-text>
		</ui-clamped>
	</button>
</template>

<style module="classes">
.control {
	cursor: pointer;
	transition: background-color 0.2s ease-in-out;
}

.icon,
.text {
	color: var(--text-300, rgb(255 255 255 / 60%));
	transition: color 0.2s ease-in-out;
}

.control:hover .text {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.control:hover .icon {
	color: var(--text-300, rgb(255 255 255 / 60%));
}

.control:active .text {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.control:active .icon {
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.m-24 {
	display: inline-flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	padding: 0 var(--tile-padding-md-in, 10px) 0 var(--tile-padding-md-in, 10px);
	gap: var(--padding-padding-s3, 4px);
}

.m-24-bg {
	display: inline-flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	padding: 0 var(--tile-padding-md-in, 10px) 0 var(--tile-padding-md-in, 10px);
	background: var(--bg-100, rgba(73 73 80 / 32%));
	border-radius: var(--radius-radius-s12-24, 9.2px);
	gap: var(--padding-padding-s3, 4px);
}

.m-24-bg:hover {
	background: var(--bg-300, rgb(73 73 80 / 52%));
}

.m-24-bg:active {
	background: var(--bg-500, rgb(73 73 80 / 90%));
}

.l-24-bg {
	display: inline-flex;
	align-items: center;
	height: var(--height-height-s16, 40px);
	padding: 0 var(--padding-padding-s10, 18px) 0 var(--padding-padding-s9, 16px);
	background: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s16-40, 15.6px);
	gap: var(--padding-paddings-s4, 6px);
}

.l-24-bg:hover {
	background: var(--bg-300, rgb(73 73 80 / 52%));
}

.l-24-bg:active {
	background: var(--bg-500, rgb(73 73 80 / 90%));
}
</style>
