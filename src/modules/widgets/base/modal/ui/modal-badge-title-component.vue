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
	font-style: normal;
	font-weight: 450;
	font-size: 11.8px;
	line-height: 165%;
	color: var(--color);
	letter-spacing: 0.059px;
	background: var(--bg);
	border-radius: 18px;
	cursor: pointer;
	gap: 4px;
}

.title.old {
	transition: color 0.2s ease, background 0.2s ease;
}

.title.old:hover {
	color: var(--control-secondary-object, #adadad);
	background: var(--color-bg-hover-base-300-hover, rgb(64 64 64 / 40%));
}

.new {
	justify-content: center;
	align-items: center;
	min-height: 24px;
	padding-right: 6px;
	padding-left: 10px;
	color: rgb(255 255 255 / 96%);
	background: rgb(73 73 80 / 70%);
	border-radius: 8px;
	gap: 3px;
}
</style>
