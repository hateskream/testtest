<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

const props = withDefaults(defineProps<{
	icon: IconIds;
	width?: number;
	height?: number;
}>(), {
	width: 20,
	height: 20,
});

const styles = computed(() => ({
	width: `${props.width}px`,
	height: `${props.height}px`,
}));
</script>

<template>
	<span :class="classes.leftIcon" :style="styles">
		<ui-icon
			:id="props.icon"
			width="14px"
			height="14px"
		/>
	</span>
</template>

<style module="classes">
.leftIcon {
	display: grid;
	color: var(--icon-color-base-300);
	border: 1px solid var(--border-color-base-300);
	border-radius: 50%;
	place-items: center;
}
</style>
