<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

interface IProps {
	backgroundColor?: CSSProperties['backgroundColor'];
	color?: CSSProperties['color'];
	paddingLeft?: CSSProperties['paddingLeft'];
}
const props = defineProps<IProps>();

const badgeColors = computed(() => ({
	backgroundColor: props.backgroundColor ?? 'var(--bg-color-base-300)',
	color: props.color ?? 'var(--text-color-base-300)',
	paddingLeft: props.paddingLeft ?? '12px',
}));
</script>

<template>
	<div :class="classes.title" :style="badgeColors">
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
