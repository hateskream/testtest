<script setup lang="ts">
import { UiIcon } from '@/shared/ui/icon';
import type { IMenuItem } from '../model';
import { UiText } from '@/shared/ui/text';

const props = defineProps<IMenuItem>();
</script>

<template>
	<router-link
		:class="[
			classes.root,
			{
				[classes.active]: props.isActive,
			},
		]"
		:to="props.link"
	>
		<div :class="classes.container">
			<ui-icon
				:id="props.icon"
				height="16px"
				width="16px"
				:class="classes.icon"
			/>
		</div>
		<ui-text
			:class="classes.text"
			token="text-50-r"
			align="center"
			as="div"
		>
			{{ props.text }}
		</ui-text>
	</router-link>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.container {
	display: flex;
	justify-content: center;
	align-items: center;
	align-self: center;
	width: 36px;
	height: 36px;
	background-color: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-04, 12px);
	transition: background-color 0.3s ease;
}

.icon {
	color: var(--contrast-contrast-60, rgb(255 255 255 / 40%));
	transition: color 0.3s ease;
}

.active .icon {
	filter: drop-shadow(0 0 8px #ffffff);
}

.text {
	color: var(--text-300, rgb(255 255 255 / 60%));
	transition: color 0.3s ease;
}

.root:hover,
.root.active {
	& .container {
		background-color: var(--bg-300, rgb(73 73 80 / 44%));
	}

	& .text {
		color: var(--text-500, rgb(255 255 255 / 96%));
	}

	& .icon {
		color: var(--icon-500, #ffffff);
	}
}

</style>
