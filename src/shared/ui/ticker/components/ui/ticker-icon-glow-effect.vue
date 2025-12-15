<script setup lang="ts">
import { computed, toValue } from 'vue';

import { useTickerIconContext } from '../../composables';
import { shouldBlockImageUrl } from '@/shared/service/images';

const props = defineProps<{
	iconSrc?: string;
	active?: boolean;
}>();

const context = useTickerIconContext();

const src = computed(() => {
	const url = props.iconSrc ?? toValue(context?.iconSrc);
	if (url && shouldBlockImageUrl(url)) {
		return '';
	}

	return url || '';
});
</script>

<template>
	<div
		v-if="src"
		:style="{
			backgroundImage: `url(${src})`,
		}"
		:class="{
			[classes.underlay]: true,
			[classes.active]: props.active
		}"
		data-icon-glow
	/>
</template>

<style module="classes">
.underlay {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	width: 100%;
	height: 100%;
	background-position: center;
	background-size: cover;
	border-radius: 999px;
	filter: blur(0);
	transition: filter 320ms cubic-bezier(0.5, 1, 0.89, 1);
	will-change: filter;
}

.active {
	filter: blur(4px);
}
</style>

<style>
[data-icon-glow-trigger]:hover [data-icon-glow] {
	filter: blur(4px);
}
</style>
