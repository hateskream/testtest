<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { UiImage } from '../image';

import iconPlaceholder from './icon-placeholder.vue';


interface ITickerIconProps {
	src: string;
	ticker: string;
}

const props = defineProps<ITickerIconProps>();


const isImageLoaded = ref(false);
function checkImage(src: string) {
	if (!src) {
		return;
	}
	const img = new Image();
	img.onload = () => isImageLoaded.value = true;
	img.onerror = () => isImageLoaded.value = false;

	img.src = src;
}

const showIcon = computed(() => {
	return props.src && isImageLoaded.value;
});

watch(() => props.src, (newSrc) => {
	checkImage(newSrc);
}, { immediate: true });
</script>

<template>
	<div :class="classes.tickerIcon">

		<!-- TODO: Custom view for Forex -->

		<ui-image v-if="showIcon" :src="props.src" />
		<icon-placeholder v-else :ticker="props.ticker" />
	</div>
</template>

<style module="classes">
.tickerIcon {
	display: flex;
}
</style>
