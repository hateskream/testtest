<script setup lang="ts">
import { computed, useCssModule } from 'vue';

interface ITabWrapperProps {
	isActive?: boolean;
	isEditing?: boolean;
}

const props = defineProps<ITabWrapperProps>();

const classes = useCssModule('classes');

const classList = computed(() => ({
	[classes.active]: props.isActive,
	[classes.editing]: props.isEditing,
}));
</script>

<template>
	<button class="text-300-r" :class="[classes.tab, classList]">
		<slot />
	</button>
</template>

<style module="classes">
.tab {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	height: auto;
	padding: 6px 12px;
	color: var(--color-text-base-300, #9a9a9d);
	white-space: nowrap;
	background-color: var(--bg-color-base-300);
	border-radius: 42px;
	cursor: pointer;
	transition: background-color 0.15s ease-in-out, color 0.12s;
	gap: 6px;
}

.tab.active {
	color: #ffffff;
	background-color: rgb(51 51 51 / 80%);
}

.tab:hover:not(.active) {
	color: #ffffff;
	background-color: rgb(64 64 64 / 40%);
}

.tab.editing {
	padding: 9px 17px;
	border: 1px solid var(--border-color-base-500);
}
</style>
