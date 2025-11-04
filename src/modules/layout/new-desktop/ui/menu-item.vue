<script setup lang="ts">
import { UiIcon } from '@/shared/ui/icon';
import type { IMenuItem } from '../model';

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

		<div :class="classes.text">
			{{ props.text }}
		</div>
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
	width: 36px;
	height: 36px;
	background: rgb(73 73 80 / 32%);
	border-radius: 12px;
}

.container:hover {
	background: rgb(73 73 80 / 48%);
}

.active .icon {
	filter: drop-shadow(0 0 8px #ffffff);
}

.text {
	font-style: normal;
	font-weight: 540;
	font-size: 9px;
	line-height: 150%; /* 13.5px */
	text-align: center;
	color: rgb(255 255 255 / 60%);
	letter-spacing: 0.072px;
}
</style>
