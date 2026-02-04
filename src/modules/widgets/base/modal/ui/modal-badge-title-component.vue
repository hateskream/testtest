<script setup lang="ts">
import { type CSSProperties } from 'vue';

interface IProps {
	backgroundColor?: CSSProperties['backgroundColor'];
	color?: CSSProperties['color'];
	paddingLeft?: CSSProperties['paddingLeft'];
	displayVariant?: 'default' | 'new';
}

const props = withDefaults(defineProps<IProps>(), {
	backgroundColor: 'var(--bg-color-base-300)',
	color: 'var(--text-color-base-300)',
	paddingLeft: '12px',
	displayVariant: 'default',
});
</script>

<template>
	<div
		:class="[
			classes.title,
			props.displayVariant === 'new' ? classes.new : classes.old,
		]"
		:style="{
			'--bg': props.backgroundColor,
			'--color': props.color,
			'--pl': props.paddingLeft,
		}"
		class="text-200-r"
	>
		<slot />
	</div>
</template>

<style module="classes">
.title {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	width: max-content;
	min-height: 32px;
	padding: 0 var(--pl, 12px);
	color: var(--color);
	background-color: var(--bg);
	border-radius: 18px;
	cursor: pointer;
	gap: 4px;
	transition: color 0.2s ease, background-color 0.2s ease;
}

.title.old:hover {
	color: var(--control-secondary-object, #adadad);
	background-color: var(--color-bg-hover-base-300-hover, rgb(64 64 64 / 40%));
}

.new {
	justify-content: center;
	align-items: center;
	min-height: 24px;
	padding-right: 6px;
	padding-left: var(--pl, 10px);
	color: rgb(255 255 255 / 96%);
	background-color: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s12-24, 9.2px);
	gap: 3px;
}

.title.new:hover {
	background-color: var(--base-50, rgb(73 73 80 / 52%));
}

.title.new:active {
	background-color: var(--bg-500, rgb(73 73 80 / 70%));
}
</style>
