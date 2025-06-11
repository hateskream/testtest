<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiImage } from '../image';

import iconLoader from './icon-loader.vue';
import iconPlaceholder from './icon-placeholder.vue';

interface IForexTickerIconProps {
	src: string[];
	ticker: string;
	domain: string;
	size?: number;
}

const props = defineProps<IForexTickerIconProps>();

const isFirstIconLoaded = ref(false);
const isSecondIconLoaded = ref(false);
const isIconsLoaded = computed(() => {
	return isFirstIconLoaded.value && isSecondIconLoaded.value;
});

const wrapperSize = computed(() => {
	// This is used to set the size of the wrapper div
	// to ensure the icon is centered and has padding
	return {
		width: props.size ? `${props.size}px` : '40px',
		height: props.size ? `${props.size}px` : '40px',
	};
});

const iconsSize = computed(() => {
	return props.size ? `${props.size - 12}px` : '28px';
});

</script>

<template>
	<div
		:class="classes.tickerIcon"
		:style="wrapperSize"
	>
		<icon-loader
			v-if="!isIconsLoaded"
			:class="classes.tickerIcon"
		/>
		<ui-image
			v-show="isIconsLoaded"
			:class="classes.firstIcon"
			:src="props.src[0]"
			:width="iconsSize"
			:height="iconsSize"
			@error="isFirstIconLoaded = true"
			@loaded="isFirstIconLoaded = true"
		>
			<template #error>
				<icon-placeholder
					:ticker="props.ticker"
				/>
			</template>
		</ui-image>

		<ui-image
			v-show="isIconsLoaded"
			:class="classes.secondIcon"
			:src="props.src[1]"
			:width="iconsSize"
			:height="iconsSize"
			@error="isSecondIconLoaded = true"
			@loaded="isSecondIconLoaded = true"
		>
			<template #error>
				<icon-placeholder :ticker="props.domain" />
			</template>
		</ui-image>
	</div>
</template>

<style module="classes">
.tickerIcon {
	position: relative;
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
}

.firstIcon,
.secondIcon {
	position: absolute;
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	padding: 2px;

	/* FIXME: use resize adaptive background */
	background: #161618;
	border: 1px solid var(--border-color-base-300);
	border-radius: 999px;
}

.firstIcon {
	bottom: 0;
	left: 0;
	z-index: 2;
}

.secondIcon {
	top: 0;
	right: 0;
	z-index: 1;
}
</style>
