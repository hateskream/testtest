<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';

interface IModalBadgeClearProps {
	displayVariant?: 'default' | 'new';
}

const props = withDefaults(defineProps<IModalBadgeClearProps>(), {
	displayVariant: 'default',
});
</script>

<template>
	<button :class="[classes.clearBadge, { [classes.new]: props.displayVariant === 'new' }]">
		<span :class="classes.iconWrapper">
			<ui-icon
				:id="IconIds.CloseThicc"
				width="6px"
				height="6px"
			/>
		</span>
		<ui-text token="text-200-r">Clear</ui-text>
	</button>
</template>

<style module="classes">
.clearBadge {
	display: flex;
	align-items: center;
	height: var(--height-height-s14, 32px);
	padding:
		var(--padding-padding-s3, 4px) var(--tile-padding-md-in, 10px)
		var(--padding-padding-s3, 4px) var(--tile-padding-md-out, 6px);
	color: var(--text-300, rgb(255 255 255 / 60%));
	border-radius: 18px;
	cursor: pointer;
	transition-timing-function: ease-in-out;
	transition-duration: 0.2s;
	transition-property: color, background-color, opacity;
	gap: var(--padding-padding-s3, 4px);
}

.clearBadge.new {
	height: var(--height-height-s12, 24px);
	border-radius: var(--radius-radius-s12-24, 9.2px);
}

.iconWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 16px;
	height: 16px;
	line-height: 0;
	color: rgb(217 217 217 / 50%);
	background-color: #353535;
	border-radius: 50%;
	transition: background-color 0.2s ease-in-out;
}

.clearBadge:hover {
	color: var(--text-color-base-500);
	background-color: var(--base-base-80, rgb(73 73 80 / 22%));
}

.clearBadge:active {
	color: var(--text-color-base-500);
	background-color: var(--bg-500, rgb(73 73 80 / 70%));
}

.clearBadge:active .iconWrapper {
	background-color: #4f4f54;
}
</style>
