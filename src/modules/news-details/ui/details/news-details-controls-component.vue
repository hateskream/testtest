<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

const emits = defineEmits<{
	back: [];
}>();
</script>

<template>
	<div :class="classes.controls">
		<button :class="classes.back" @click="emits('back')">
			<ui-icon
				:id="IconIds.Arrow"
				width="12px"
				height="12px"
			/>
			Back
		</button>
	</div>
</template>

<style module="classes">
.controls {
	display: flex;
	align-items: center;
	width: 100%;
	height: 32px;
	margin-bottom: 6px;
	padding: 0 16px;
}

.back {
	display: flex;
	align-items: center;
	height: 32px;
	padding: 0 12px 0 0;
	font-size: 15px;
	line-height: 1;
	color: var(--color-text-base-300, #9a9a9d);
	border-radius: 500px;
	cursor: pointer;
	transition: background-color 0.15s ease;
	gap: 4px;

	&:hover {
		color: #ffffff;
	}
}
</style>
