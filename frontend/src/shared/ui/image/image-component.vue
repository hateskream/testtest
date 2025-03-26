<script setup lang="ts">
import { computed, watch, ref, type CSSProperties } from 'vue';

interface IUiImage {
	height?: string;
	width?: string;
	src: string;
	alt?: string;
	replacement?: string;
	loading?: 'lazy' | 'eager';
}

const props = withDefaults(defineProps<IUiImage>(), {
	loading: 'eager',
	alt: '',
	width: '100%',
	height: '100%',
	replacement: '',
});

const refImg = ref<HTMLImageElement | null>(null);

const replacementSrcUrl = computed(() => {
	if (!props.replacement) {
		return '';
	}

	const { origin, href } = new URL(`@/assets/images/${props.replacement}`, import.meta.url);

	return href.replace(origin, '');
});

const currentSrc = ref(replacementSrcUrl.value);

const inlineStyles = computed((): Partial<CSSProperties> => {
	const { width, height } = props;
	return { width, height };
});

watch(
	() => props.src,
	async newSrc => {
		currentSrc.value = replacementSrcUrl.value;

		if (!newSrc) {
			return;
		}

		const isValid = await tryLoadImage(newSrc);

		if (isValid) {
			currentSrc.value = newSrc;
		}
	},
	{ immediate: true },
);

watch(refImg, () => {
	if (!refImg.value) {
		return;
	}

	refImg.value.onerror = () => {
		refImg.value!.src = replacementSrcUrl.value;
	};
});

async function tryLoadImage(src: string): Promise<boolean> {
	return new Promise(resolve => {
		const img = new Image();
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = src;
	});
}
</script>

<template>
	<img
		ref="refImg"
		:src="currentSrc"
		:alt="props.alt"
		loading="lazy"
		:style="inlineStyles"
	/>
</template>
