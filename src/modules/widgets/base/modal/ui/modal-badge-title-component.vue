<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

interface IProps {
	backgroundColor?: CSSProperties['backgroundColor'];
	color?: CSSProperties['color'];
}
const props = defineProps<IProps>();

const badgeColors = computed(() => ({
	backgroundColor: props.backgroundColor ?? 'var(--bg-color-base-300)',
	color: props.color ?? 'var(--text-color-base-300)',
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
	align-items: center;
	width: max-content;
	height: auto;
	padding: 8px 12px;
	font-weight: 300;
	font-size: 10px;
	text-align: left;
	border-radius: 18px;
	cursor: pointer;
	gap: 4px;
}
</style>
