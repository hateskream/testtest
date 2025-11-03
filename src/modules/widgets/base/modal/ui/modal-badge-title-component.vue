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
		:class="classes.title"
		:style="{
			backgroundColor: props.backgroundColor,
			color: props.color,
			paddingLeft: props.paddingLeft,
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
	height: 32px;
	padding: 0 12px;
	font-weight: 300;
	font-size: 10px;
	text-align: left;
	border-radius: 18px;
	cursor: pointer;
	gap: 4px;
}
</style>
