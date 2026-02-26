<script setup lang="ts">
import { computed, watch, ref, type CSSProperties } from 'vue';

import { UiSkeleton } from '../skeleton';
import { shouldBlockImageUrl } from '@/shared/service/images';

interface IUiImage {
	height?: string;
	width?: string;
	src: string;
	alt?: string;
	replacement?: string;
	loading?: 'lazy' | 'eager';
	showLoader?: boolean;
	skipBlacklist?: boolean;
	timeout?: number;
}

const props = withDefaults(defineProps<IUiImage>(), {
	loading: 'eager',
	alt: '',
	width: '100%',
	height: '100%',
	replacement: '',
	showLoader: false,
	skipBlacklist: false,
	timeout: 10_000,
});

const emit = defineEmits<{
	(e: 'loaded'): void;
	(e: 'error'): void;
	(e: 'blacklisted', ticker: string): void;
}>();

const refImg = ref<HTMLImageElement | null>(null);

const currentSrc = ref(props.replacement);
const isValidSrc = ref(false);
const isImageLoaded = ref(false);

const inlineStyles = computed((): Partial<CSSProperties> => {
	const { width, height } = props;
	return { width, height };
});

watch(
	() => props.src,
	async newSrc => {
		currentSrc.value = props.replacement;

		if (!newSrc) {
			isValidSrc.value = false;
			isImageLoaded.value = true;
			emit('error');
			return;
		}

		if (!props.skipBlacklist && shouldBlockImageUrl(newSrc)) {
			isValidSrc.value = false;
			isImageLoaded.value = true;
			emit('blacklisted', newSrc);
			emit('error');
			return;
		}

		isValidSrc.value = await tryLoadImage(newSrc);

		if (isValidSrc.value) {
			currentSrc.value = newSrc;
		}
	},
	{ immediate: true },
);

watch(refImg, () => {
	if (!refImg.value) {
		return;
	}

	if (props.replacement) {
		refImg.value.onerror = () => {
			refImg.value!.src = props.replacement;
		};
	}
});

async function tryLoadImage(src: string): Promise<boolean> {
	return new Promise(resolve => {
		const img = new Image();
		const timer = setTimeout(() => {
			img.onload = null;
			img.onerror = null;
			img.src = '';
			isImageLoaded.value = true;
			emit('error');
			resolve(false);
		}, props.timeout);

		img.onload = () => {
			clearTimeout(timer);
			isImageLoaded.value = true;
			emit('loaded');
			resolve(true);
		};
		img.onerror = () => {
			clearTimeout(timer);
			isImageLoaded.value = true;
			emit('error');
			resolve(false);
		};
		img.src = src;
	});
}

defineOptions({ inheritAttrs: false });
</script>

<template>
	<slot v-if="!isImageLoaded && showLoader" name="loading">
		<ui-skeleton
			:size="props.width"
			:shape="'rectangle'"
			:animation="'wave'"
			:opacity="0.5"
		/>
	</slot>

	<slot v-else-if="!isValidSrc && isImageLoaded" name="error" />

	<img
		v-else-if="currentSrc && isValidSrc"
		ref="refImg"
		:src="currentSrc"
		:alt="props.alt"
		loading="lazy"
		:style="inlineStyles"
		v-bind="$attrs"
	/>
</template>
