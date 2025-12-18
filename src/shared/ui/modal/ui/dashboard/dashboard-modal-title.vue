<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

const props = defineProps<{
	bordered?: boolean;
}>();
</script>

<template>
	<div :class="[classes.title, { [classes.bordered]: props.bordered }]">
		<ui-text token="text-200-r">
			<slot />
		</ui-text>
	</div>
</template>

<style module="classes">
.title {
	display: flex;
	align-items: center;
	min-height: 36px;
}

.title:not(.bordered) {
	flex: 1 0 0;
	justify-content: space-between;
	width: 100%;
	height: var(--height-height-s15, 36px);
	padding: 10px 16px 4px;
	color: var(--text-300, rgb(255 255 255 / 62%));
	user-select: none;
}

.title.bordered {
	align-self: stretch;
	box-sizing: border-box;
	height: 40px;
	padding: 0 var(--padding-padding-s9, 16px);
	font-weight: 510;
	color: var(--color-text-base-500, #ffffff);
	border-bottom: 1px solid var(--border-surf-04, rgb(73 73 80 / 32%));
}
</style>
