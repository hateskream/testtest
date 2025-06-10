<script setup lang="ts">
import { UiImage } from '../image';

import iconPlaceholder from './icon-placeholder.vue';

interface ITickerIconProps {
	src: string;
	ticker: string;
	market: string;
}

const props = defineProps<ITickerIconProps>();
</script>

<template>
	<div :class="classes.tickerIcon">
		<ui-image :src="props.src">
			<template #error>
				<icon-placeholder :ticker="props.ticker" />
			</template>

			<template #loading>
				<icon-placeholder :ticker="props.ticker" />
			</template>
		</ui-image>
	</div>
</template>

<style module="classes">
.tickerIcon {
	display: flex;
}
</style>
