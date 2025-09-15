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
	<div :class="[classes.tab, classList]">
		<slot />
	</div>
</template>

<style module="classes">
.tab {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	height: auto;
	padding: 8px 12px;
	font-weight: 380;
	font-size: 10px;
	line-height: 170%;
	color: #adadad;
	letter-spacing: 0.04px;
	background-color: var(--bg-color-base-300);
	border-radius: 42px;
	cursor: pointer;
	gap: 6px;
	white-space: nowrap;
}

.tab.active {
	color: #ffffff;
	background-color: rgb(51 51 51 / 80%);
}

.tab:hover:not(.active) {
	background-color: rgb(64 64 64 / 40%);
}

.tab.editing {
	padding: 9px 17px;
	border: 1px solid var(--border-color-base-500);
}
</style>
