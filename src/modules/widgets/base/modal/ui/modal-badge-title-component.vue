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
			{
				[classes.new]: props.displayVariant === 'new',
			},
		]"
		:style="{
			backgroundColor: props.displayVariant === 'new' ? 'rgb(73 73 80 / 70%)' : props.backgroundColor,
			color: props.displayVariant === 'new' ? 'rgb(255 255 255 / 96%)' : props.color ,
			paddingLeft: props.displayVariant === 'new' ? '10px' : props.paddingLeft,
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
	padding: 0 12px;
	font-style: normal;
	font-weight: 450;
	font-size: 11.8px;
	line-height: 165%; /* 19.47px */
	color: rgb(255 255 255 / 96%);
	letter-spacing: 0.059px;
	border-radius: 18px;
	cursor: pointer;
	gap: 4px;
}

.new {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 24px;
	padding-right: 6px;
	padding-left: 10px;
	background: rgb(73 73 80 / 70%);
	border-radius: 8px;
	gap: 3px;
}
</style>
