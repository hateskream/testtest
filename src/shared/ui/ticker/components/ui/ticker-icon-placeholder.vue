<script setup lang="ts">
import { computed } from 'vue';

interface IIconPlaceholderProps {
	ticker: string;
}

const props = defineProps<IIconPlaceholderProps>();

const tickerLetter = computed(() => {
	return props.ticker.charAt(0);
});
</script>

<template>
	<div :class="classes.iconPlaceholder">
		{{ tickerLetter }}
	</div>
</template>

<style module="classes">
.iconPlaceholder {
	display: grid;
	flex-shrink: 0;
	width: 100%;
	height: 100%;
	font-style: normal;
	font-weight: 390;
	font-size: var(--font-title-200-size);
	text-align: center;
	color: var(--text-color-base-300);
	letter-spacing: 0.075px;
	border-radius: 50%;
	place-items: center;
}
</style>
