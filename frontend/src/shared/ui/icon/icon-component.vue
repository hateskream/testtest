<script setup lang="ts">
import { computed, watch, shallowRef } from 'vue';

import type { IconIds } from './icons';
import { getIconComponent } from './icon-cache';

interface IUiIconProps {
	id: IconIds;
	width?: string | number;
	height?: string | number;
}

const props = withDefaults(defineProps<IUiIconProps>(), {
	width: '16px',
	height: '16px',
});

const icon = shallowRef(getIconComponent(props.id));

const iconStyle = computed(() => ({
	width: normalizeSize(props.width),
	height: normalizeSize(props.height),
}));

watch(
	() => props.id,
	newId => {
		icon.value = getIconComponent(newId);
	},
);

function normalizeSize(value: string | number): string {
	return typeof value === 'number' ? `${value}px` : value;
}
</script>

<template>
	<span
		class="icon-container"
		:style="iconStyle"
	>
		<component
			:is="icon"
			:class="classes.root"
		/>
	</span>
</template>

<style module="classes">
.icon-container {
	display: inline-flex;
	justify-content: center;
	align-items: center;
}

.root {
	width: 100%;
	height: 100%;
	overflow: hidden;
	fill: currentcolor;
}
</style>
