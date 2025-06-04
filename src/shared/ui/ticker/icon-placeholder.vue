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
	flex-shrink: 0;
	width: 24px;
	font-style: normal;
	font-weight: 390;
	font-size: var(--typography-headers-size-h00);
	text-align: center;
	color: var(--text-color-base-300);
	letter-spacing: 0.075px;
}
</style>
