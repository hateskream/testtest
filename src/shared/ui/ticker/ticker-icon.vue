<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiImage } from '../image';
import { UiIcon } from '@/shared/ui/icon';
import { IconIds } from '@/shared/ui/icon';

import iconPlaceholder from './icon-placeholder.vue';

interface ITickerIconProps {
	src: string;
	ticker: string;
	size?: number;
	padding?: number;
}

const isImageLoaded = ref(false);

const props = defineProps<ITickerIconProps>();

const isIconId = computed(() => {
	return Object.values(IconIds).includes(props.src as IconIds);
});

const wrapperSize = computed(() => {
	return {
		width: props.size ? `${props.size + (props.padding !== undefined ? props.padding : 8)}px` : '40px',
		height: props.size ? `${props.size + (props.padding !== undefined ? props.padding : 8)}px` : '40px',
	};
});

const iconSize = computed(() => {
	// This is used to set the size of the image
	return props.size ? `${props.size}px` : '32px';
});
</script>

<template>
	<div
		:class="classes.tickerIcon"
		:style="[
			{ border: !isIconId && isImageLoaded ? `1px solid var(--border-color-base-300)` : 'none' },
			wrapperSize
		]"
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
			@loaded="isImageLoaded = true"
			@error="isImageLoaded = true"
		>
			<template #error>
				<icon-placeholder :ticker="props.ticker" />
			</template>
		</ui-image>
	</div>
</template>

<style module="classes">
.tickerIcon {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	text-align: center;
	background: transparent;
	backdrop-filter: none;
	border-radius: 999px;
	isolation: isolate;
}

.iconContainer {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	border-radius: 999px;
}
</style>
