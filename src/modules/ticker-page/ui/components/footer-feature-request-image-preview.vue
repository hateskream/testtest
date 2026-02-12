<script setup lang="ts">
import { UiIcon, IconIds } from '@/shared/ui/icon';

defineProps<{
	url: string;
	filename: string;
}>();

const emits = defineEmits<{
	remove: [];
}>();
</script>

<template>
	<button
		:class="classes.item"
		:style="{ backgroundImage: `url(${url})` }"
		:title="filename"
	>
		<span :class="classes.removeButton" @click="emits('remove')">
			<ui-icon
				:id="IconIds.CloseThicc"
				width="6px"
				height="6px"
			/>
		</span>
	</button>
</template>

<style module="classes">
.item {
	position: relative;
	width: 40px;
	height: 40px;
	overflow: hidden;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	border-radius: var(--radius-radius-s16-40, 15.6px);
	transition: transform 0.2s ease-in-out;
}

.item:hover {
	transform: scale(1.1);
}

.removeButton {
	position: absolute;
	top: 4px;
	right: 4px;
	display: grid;
	justify-content: center;
	width: 16px;
	height: 16px;
	padding: 0;
	line-height: 0;
	color: var(--icon-300, rgb(255 255 255 / 50%));
	background: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: 500px;
	cursor: pointer;
	place-items: center;
	backdrop-filter: blur(9px);
}

.removeButton:hover {
	color: rgb(255 255 255 / 80%);
	background: rgb(73 73 80 / 64%);
}
</style>
