<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { UiText } from '@/shared/ui/text';
import { UiClamped } from '../clamped';
import { UiIcon, type IconIds } from '@/shared/ui/icon';
import type { TextToken } from '@/shared/ui/text/token';
import type { UiControlTokens } from './model';

const props = defineProps<{
	token: UiControlTokens;
	iconId?: IconIds;
	disabled?: boolean;
	isMobile?: boolean;
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

const classes = useCssModule('classes');

const buttonClasses = computed(() => ([
	classes.control,
	classes[props.token],
	{
		[classes.mobile]: props.isMobile,
	},
]));
</script>

<template>
	<button :class="buttonClasses" :disabled="props.disabled">
		<ui-icon
			v-if="props.iconId"
			:id="props.iconId"
			:class="classes.icon"
			width="16px"
			height="16px"
		/>
		<ui-clamped v-if="$slots.default" :rows="1">
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

.icon-24,
.icon-24-bg {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: var(--height-height-s12, 24px);
	gap: var(--padding-padding-s0, 0);
	aspect-ratio: 1/1;
	fill: var(--icon-300, rgb(255 255 255 / 50%));
}

.icon-24 .icon,
.icon-24-bg .icon {
	width: 16px;
	height: 16px;
}

.icon-24:active,
.icon-24:hover,
.icon-24-bg:active,
.icon-24-bg:hover {
	fill: var(--icon-500, #ffffff);
}

.icon-24:active:hover,
.icon-24-bg:active:hover {
	fill: var(--icon-300, rgb(255 255 255 / 50%));
}

.icon-24:disabled,
.icon-24-bg:disabled {
	fill: var(--icon-100, rgb(255 255 255 / 18%));
	cursor: not-allowed;
}

.icon-24.mobile {
	width: 44px;
	height: var(--height-height-s17, 44px);
	aspect-ratio: 1/1;
}

@media screen and (max-width: 768px) {
	.icon-24 {
		width: 44px;
		height: var(--height-height-s17, 44px);
		aspect-ratio: 1/1;
	}
}

.icon-24-bg {
	background: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s12-24, 9.2px);
	backdrop-filter: blur(9px);
}

.icon-24-bg:hover {
	background: var(--bg-300, rgb(73 73 80 / 52%));
}

.icon-24-bg:active {
	background: var(--bg-500, rgb(73 73 80 / 90%));
}

.icon-24-bg:disabled {
	background: var(--atom-base-80, rgb(73 73 80 / 22%));
}
</style>
