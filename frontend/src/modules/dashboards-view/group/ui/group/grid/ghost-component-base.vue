<script setup lang="ts">
interface IGhostComponentProps {
	title: string;
}

const props = defineProps<IGhostComponentProps>();
</script>

<template>
	<div :class="classes.root">
		{{ props.title }}
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	width: 180px;
	height: 44px;
	padding: 8px 10px 4px;
	overflow: hidden;
	font-style: normal;
	font-weight: 300;
	font-size: var(--typography-headers-size-h-01, 13px);
	line-height: 170%;
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.104px;
	text-overflow: ellipsis;
	background: var(--bg-color-surface-02);
	border: 1px solid var(--border-color-surface-01);
	border-radius: 18px;
}
</style>
