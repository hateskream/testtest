<script setup lang="ts">

interface IDashboardComponentProps {
	title: string;
}

const props = defineProps<IDashboardComponentProps>();

</script>

<template>
	<div :class="classes.root">{{ props.title }}</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	width: 180px;
	height: 44px;
	padding: 8px 10px 4px;
	overflow: hidden;
	background: var(--bg-color-surface-02);
	border: 1px solid var(--border-color-surface-01);
}
</style>
