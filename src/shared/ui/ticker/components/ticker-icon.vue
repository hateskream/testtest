<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';

import { UiImage } from '@/shared/ui/image';
import { UiIcon } from '@/shared/ui/icon';
import { IconIds } from '@/shared/ui/icon';
import { useProvideTickerIconContext } from '../composables';

import TickerIconPlaceholder from './ui/ticker-icon-placeholder.vue';
import TickerIconGlowEffect from './ui/ticker-icon-glow-effect.vue';
import TickerIconLoader from './ui/ticker-icon-loader.vue';

interface ITickerIconProps {
	src?: string;
	ticker: string;
	size?: number;
}

const isImageLoaded = ref(false);
const isError = ref(false);

const props = withDefaults(defineProps<ITickerIconProps>(), {
	size: 16,
	src: '',
});

const isIconId = computed(() => {
	return Object.values(IconIds).includes(props.src as IconIds);
});

const wrapperSize = computed(() => {
	const size = (props.size || 16);

	return {
		width: `${size}px`,
		height: `${size}px`,
	};
});

const iconSize = computed(() => {
	return wrapperSize.value.width;
});

const isBorder = computed(() =>
	isError.value || !isIconId.value && !isImageLoaded.value,
);

function onImageLoaded(): void {
	isImageLoaded.value = true;
	isError.value = false;
}

function onImageError(): void {
	isImageLoaded.value = true;
	isError.value = true;
}

useProvideTickerIconContext({
	iconSrc: () => props.src,
});

const slots = useSlots();

defineSlots<{
	glow: unknown;
}>();

watch(isIconId, (value) => {
	if (value) {
		onImageLoaded();
	}
}, { immediate: true });
</script>

<template>
	<div
		:class="[
			classes.tickerIcon,
			{
				[classes.bordered]: isBorder
			}
		]"
		:style="wrapperSize"
	>

		<ui-icon
			v-if="isIconId"
			:id="props.src as IconIds"
			:width="iconSize"
			:height="iconSize"
		/>

		<ui-image
			v-else
			:class="classes.iconContainer"
			:src="props.src"
			:width="iconSize"
			:height="iconSize"
			show-loader
			@loaded="onImageLoaded"
			@error="onImageError"
		>
			<template #loading>
				<ticker-icon-loader :size="iconSize" />
			</template>
			<template #error>
				<ticker-icon-placeholder :ticker="props.ticker" />
			</template>
		</ui-image>

		<template v-if="isImageLoaded">
			<template v-if="slots.glow">
				<slot name="glow" />
			</template>

			<ticker-icon-glow-effect
				v-else
				:class="classes.glow"
			/>
		</template>
	</div>
</template>

<style module="classes">
.tickerIcon {
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
}

.tickerIcon:hover .glow {
	filter: blur(4px);
}

.iconContainer {
	z-index: 1;
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	border-radius: 999px;
	object-fit: cover;
}

.bordered {
	border: 1px solid var(--border-color-base-300);
}
</style>
