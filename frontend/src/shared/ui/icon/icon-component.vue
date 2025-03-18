<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

interface IUiIconProps {
	id: string;
	width?: string;
	height?: string;
}

const props = defineProps<IUiIconProps>();

const xlinkHref = computed((): string => `#icon-${props.id}`);

const inlineStyles = computed((): Partial<CSSProperties> => {
	const { width, height } = props;
	return { width, height };
});
</script>

<template>
	<svg
		:class="classes.root"
		aria-hidden="true"
		role="img"
		:style="inlineStyles"
	>
		<use :xlink:href="xlinkHref" />
	</svg>
</template>

<style module="classes">
.root {
	width: 1em;
	height: 1em;
	overflow: hidden;
	fill: currentcolor;
}
</style>
