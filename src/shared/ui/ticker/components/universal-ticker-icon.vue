<script setup lang="ts" generic="T extends SymbolType">
import { SymbolType } from '@/modules/cell';

import TickerIcon from './ticker-icon.vue';
import ForexTickerIcon from './forex-ticker-icon.vue';

const props = defineProps<{
	symbolType: T;

	src: string | string[];
	size: number;
	ticker: string;
}>();
</script>

<template>
	<forex-ticker-icon
		v-if="props.symbolType === SymbolType.Forex"
		:ticker="ticker"
		:size="size"
		:src="<[string, string]>src"
	>
		<template #glow v-if="$slots['forex-first-item-glow']">
			<slot name="forex-first-item-glow" />
		</template>
		<template #glow1 v-if="$slots.glow1">
			<slot name="glow1" />
		</template>
	</forex-ticker-icon>

	<ticker-icon
		v-else
		:src="<string>src"
		:ticker="ticker"
		:size="size"
	>
		<template #glow v-if="$slots.glow">
			<slot name="glow" />
		</template>
	</ticker-icon>
</template>
