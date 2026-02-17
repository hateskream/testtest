<script setup lang="ts">
import { computed } from 'vue';
import { useBreakpoints } from '@vueuse/core';

import { Layout } from '../../models';

import ColumnsLayoutDesktop from './columns-layout-desktop.vue';
import ColumnsLayoutTablet from './columns-layout-tablet.vue';
import ColumnsLayoutMobile from './columns-layout-mobile.vue';

interface IProps {
	disableScroll?: boolean;
}

const props = defineProps<IProps>();

const breakpoints = useBreakpoints({
	tablet: 520,
	desktop2col: 656,
	desktop3col: 1132,
});

const isTablet = breakpoints.greaterOrEqual('tablet');
const isDesktopWith3Col = breakpoints.greaterOrEqual('desktop3col');

const layout = computed(() => {
	if (isDesktopWith3Col.value) {
		return Layout.Desktop;
	}

	if (isTablet.value) {
		return Layout.Tablet;
	}

	return Layout.Mobile;
});

const layoutComponentMap = {
	[Layout.Desktop]: ColumnsLayoutDesktop,
	[Layout.Tablet]: ColumnsLayoutTablet,
	[Layout.Mobile]: ColumnsLayoutMobile,
} as const;

const LayoutComponent = computed(() => layoutComponentMap[layout.value]);
</script>

<template>
	<layout-component v-if="$slots.mainCol || $slots.leftCol || $slots.rightCol" :disable-scroll="props.disableScroll">
		<template #leftCol>
			<slot name="leftCol" :layout="layout"></slot>
		</template>
		<template v-if="$slots.mainCol" #mainCol>
			<slot name="mainCol" :layout="layout"></slot>
		</template>
		<template #rightCol>
			<slot name="rightCol" :layout="layout"></slot>
		</template>
	</layout-component>
</template>
