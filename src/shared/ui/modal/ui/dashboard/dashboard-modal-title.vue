<script setup lang="ts">
withDefaults(defineProps<{
	bordered?: boolean;
}>(), {
	bordered: false,
});
</script>

<template>
	<div v-if="bordered" :class="classes.bordered">
		<slot />
	</div>

	<div v-else :class="classes.title">
		<slot />
	</div>
</template>

<style module="classes">
.bordered {
	display: flex;
	align-items: center;
	align-self: stretch;
	box-sizing: border-box;
	height: 40px;
	padding: 0 var(--padding-padding-s9, 16px);
	font-style: normal;
	font-weight: 510;
	font-size: var(--font-text-200-b-size, 12.2px);
	line-height: 180%; /* 21.96px */
	color: var(--color-text-base-500, #ffffff);
	letter-spacing: 0.122px;
	border-bottom: 1px solid var(--border-surf-04, rgb(73 73 80 / 32%));
}

.title {
	display: flex;
	flex: 1 0 0;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: var(--height-height-s15, 36px);
	min-height: 36px;
	padding: 10px 16px 4px;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-300-r-size, 13.3px);
	line-height: 180%;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.146px;
	user-select: none;
}
</style>
