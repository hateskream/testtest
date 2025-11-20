<script setup lang="ts">
import type { CSSProperties } from 'vue';

interface IProps {
	label?: string;
	labelColor?: CSSProperties['color'];
	color?: CSSProperties['color'];
}

const props = withDefaults(defineProps<IProps>(), {
	label: '',
	labelColor: 'var(--contrast-contrast-50, rgb(255 255 255 / 50%))',
	color: 'var(--base-base-30, rgb(73 73 80 / 70%))',
});
</script>

<template>
	<div :class="classes.container">
		<span v-if="props.label.length" :class="classes.label">{{ props.label }}</span>
		<div :class="classes.delimiter"></div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	width: 1px;
	gap: 3px;
}

.delimiter {
	width: 100%;
	height: 12px;
	background-color: v-bind(color);
	border-radius: var(--radius-full, 9999px);
}

.label {
	width: max-content;
	font-weight: 400;
	font-size: var(--font-text-100-r-size, 11px);
	line-height: 180%;
	color: v-bind(labelColor);
	letter-spacing: 0.088px;
}
</style>
