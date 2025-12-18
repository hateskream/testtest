<script setup lang="ts">
import { computed, useCssModule } from 'vue';

const props = defineProps<{
	isActive? : boolean;
	isEditing? : boolean;
}>();

const classes = useCssModule('classes');

const classList = computed(() => ({
	[classes.disabled]: !props.isActive,
	[classes.editing]: props.isEditing,
}));
</script>

<template>
	<button :class="[classes.chip, classList]">
		<slot />
	</button>
</template>

<style module="classes">
.chip {
	display: flex;
	align-items: center;
	height: var(--height-height-s12, 24px);
	padding:
		var(--padding-padding-s3, 4px) var(--padding-padding-s6, 10px)
		var(--padding-padding-s3, 4px) var(--tile-padding-md-in, 10px);
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	color: var(--text-500, rgb(255 255 255 / 96%));
	letter-spacing: 0.122px;
	background: var(--bg-500, rgb(73 73 80 / 90%));
	border-radius: var(--radius-radius-s12-24, 9.2px);
	gap: var(--padding-padding-s3, 4px);
	cursor: pointer;
	transition: background-color 0.15s ease-in-out, color 0.12s;
}

.disabled {
	color: var(--text-300, rgb(255 255 255 / 60%));
	background: var(--bg-100, rgb(73 73 80 / 32%));
}

.disabled:hover {
	color: var(--text-400, rgb(255 255 255 / 96%));
	background: var(--bg-300, rgb(73 73 80 / 60%));
}
</style>
