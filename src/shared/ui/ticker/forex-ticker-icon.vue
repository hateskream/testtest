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
	padding?:number;
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
		width: props.size ? `${props.size + (props.padding? props.padding :8)}px` : '40px',
		height: props.size ? `${props.size + (props.padding? props.padding: 8)}px` : '40px',
	};
});

const iconsSize = computed(() => {
	return props.size ? `${props.size - 5}px` : '28px';
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
					:class="classes.firstIcon"
					:ticker="props.ticker"
					:style="{ width: iconsSize, height: iconsSize }"
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
				<icon-placeholder
					:class="classes.secondIcon"
					:ticker="props.domain"
					:style="{ width: iconsSize, height: iconsSize }"
				/>
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
	clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 74%, 55% 100%, 50% 71%, 29% 54%, 0 49%, 0% 35%, 20% 10%);
}
</style>
