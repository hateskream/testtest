<script setup lang="ts">
import { computed } from 'vue';

import { getHighlightColor } from '../../model/colors';

const props = defineProps<{
	favorite: boolean;
	soon?: boolean;
}>();

const highlightColor = computed(
	() => getHighlightColor(props.favorite, props.soon),
);
</script>

<template>
	<div
		:class="classes.lightning"
		:style="highlightColor"
	/>
</template>

<style module="classes">
.lightning {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	width: 33px;
	height: 100%;
	background:
		linear-gradient(
			270deg,
			var(--light-start) 0%,
			var(--light-mid) 100%
		);
	border-left: 2px solid var(--light-border);
	pointer-events: none;
}
</style>
