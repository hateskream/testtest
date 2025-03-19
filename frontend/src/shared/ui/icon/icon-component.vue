<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import type { IconIds } from './icons';

interface IUiIconProps {
	id: IconIds;
	width?: CSSProperties['width'];
	height?: CSSProperties['height'];
}

const props = defineProps<IUiIconProps>()

const xlinkHref = computed<string>(() => `#icon-${props.id}`);

const inlineStyles = computed<Partial<CSSProperties>>(() => ({
	width: props.width,
	height: props.height,
}));
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
}
</style>
