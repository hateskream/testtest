<script setup lang="ts">
import { computed } from 'vue';
import { useCssVar } from '@vueuse/core';

const props = defineProps<{ isNegative?: boolean }>();

const positiveColor = useCssVar('--metrics-color-positive-chart', document.documentElement);
const negativeColor = useCssVar('--metrics-color-negative-chart', document.documentElement);

const fillColor = computed((): string => {
	return props.isNegative
		? (negativeColor.value || 'rgb(252 74 107 / 100%)')
		: (positiveColor.value || 'rgb(4 236 160 / 100%)');
});

const transformStyle = computed((): string => {
	return props.isNegative ? 'rotate(180deg)' : '';
});
</script>

<template>
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		:style="{ transform: transformStyle }"
	>
		<mask
			id="mask0_20308_337973"
			style="mask-type: alpha;"
			maskUnits="userSpaceOnUse"
			x="0"
			y="0"
			width="16"
			height="16"
		>
			<path
				d="M4.92219 11.7755C4.92219 11.5934 5.0732 11.4424 5.2553 11.4424L10.745 11.4424C10.9271 11.4424
        11.0781 11.5934 11.0781 11.7755C11.0781 11.9576 10.9271 12.1086 10.745 12.1086L5.2553 12.1086
        C5.0732 12.1086 4.92219 11.962 4.92219 11.7755Z"
				fill="#292D32"
			/>
			<path
				d="M5.87722 9.84912L10.1277 9.84912C10.9983 9.84912 11.5446 8.90308 11.1093 8.14802L10.0478 6.30479
        L8.98184 4.46157C8.54657 3.70651 7.4584 3.70651 7.02313 4.46157L5.95717 6.30479L4.89565 8.14802
        C4.46038 8.90308 5.00224 9.84912 5.87722 9.84912Z"
				fill="#292D32"
			/>
		</mask>
		<g mask="url(#mask0_20308_337973)">
			<path d="M0 16L16 16L16 0L0 0L0 16Z" :fill="fillColor" />
		</g>
	</svg>
</template>
