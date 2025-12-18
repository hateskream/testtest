<script setup lang="ts">
defineProps<{
	isActive?: boolean;
}>();
</script>

<template>
	<div :class="classes.top">
		<span :class="[classes.rowTitle, isActive && classes.titleActive]">
			<slot />
		</span>

		<slot name="right" />
	</div>
</template>

<style module="classes">
.top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	height: 42px;
	margin-bottom: 3px;
}

.rowTitle {
	min-width: 118px;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
	transition: color 0.12s ease-in-out;
}

.titleActive {
	color: var(--text-color-base-300-activated);
}

.rowTitle::first-letter {
	text-transform: uppercase;
}
</style>
