<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiImage } from '@/shared/ui/image';
import { UiSkeleton } from '@/shared/ui/skeleton';
import { UiText } from '@/shared/ui/text';

interface IUiFlagProps {
	size?: number;
	country: string;
}

const props = withDefaults(defineProps<IUiFlagProps>(), {
	size: 20,
});

const iconSize = computed(() => `${props.size}px`);

const flagSrc = computed(() => `https://flagcdn.com/${props.country.toLowerCase()}.svg`);

const countryLetter = computed(() => props.country.slice(0, 2).toUpperCase());

const isError = ref(false);
const isImageLoaded = ref(false);

function onError() {
	isError.value = true;
}

function onLoaded() {
	isImageLoaded.value = true;
}

const isBorder = computed(() =>
	isError.value && !isImageLoaded.value,
);
</script>

<template>
	<div :class="[classes.flag, { [classes.bordered]: isBorder }]" :style="{width: iconSize, height: iconSize}">
		<ui-image
			:class="classes.image"
			:src="flagSrc"
			:width="iconSize"
			:height="iconSize"
			show-loader
			@error="onError"
			@loaded="onLoaded"
		>
			<template #loading>
				<ui-skeleton
					:width="iconSize"
					:height="iconSize"
					shape="rectangle"
					animation="wave"
					:opacity="0.5"
					border-radius="50%"
				/>
			</template>
			<template #error>
				<div :class="classes.placeholder">
					<slot name="error-placeholder">
						<ui-text token="text-100-r" align="center">{{ countryLetter }}</ui-text>
					</slot>
				</div>
			</template>
		</ui-image>
	</div>
</template>

<style module="classes">
.flag {
	position: relative;
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	text-align: center;
	background: transparent;
	border-radius: 999px;
	backdrop-filter: none;
	isolation: isolate;
	aspect-ratio: 1 / 1;
}

.bordered {
	border: 1px solid var(--border-color-base-300);
}

.image {
	border-radius: 50%;
	object-fit: cover;
	object-position: 25%;
}

.placeholder {
	display: grid;
	flex-shrink: 0;
	width: 100%;
	color: var(--text-color-base-300);
	border-radius: 50%;
	place-items: center;
}
</style>
