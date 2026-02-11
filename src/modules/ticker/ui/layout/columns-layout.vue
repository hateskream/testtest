<script setup lang="ts">
import { computed } from 'vue';
import { useBreakpoints } from '@vueuse/core';

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

const LayoutComponent = computed(() => {
	if (isDesktopWith3Col.value) {
		return ColumnsLayoutDesktop;
	}

	if (isTablet.value) {
		return ColumnsLayoutTablet;
	}

	return ColumnsLayoutMobile;
});
</script>

<template>
	<layout-component v-if="$slots.mainCol || $slots.leftCol || $slots.rightCol" :disable-scroll="props.disableScroll">
		<template #leftCol>
			<slot name="leftCol"></slot>
		</template>
		<template v-if="$slots.mainCol" #mainCol>
			<slot name="mainCol"></slot>
		</template>
		<template #rightCol>
			<slot name="rightCol"></slot>
		</template>
	</layout-component>
</template>
