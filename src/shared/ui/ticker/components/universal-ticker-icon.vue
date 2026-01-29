<script setup lang="ts" generic="T extends SymbolType | MarketType">
import { SymbolType } from '@/modules/cell';
import { MarketType } from '@/modules/market';

import TickerIcon from './ticker-icon.vue';
import ForexTickerIcon from './forex-ticker-icon.vue';

const props = defineProps<{
	symbolType: T;
	size: number;

	src?: string;
	rightSrc?: string;

	ticker: string;
	rightTicker?: string;
	disableGlow?: boolean;
}>();
</script>

<template>
	<forex-ticker-icon
		v-if="props.symbolType === SymbolType.Forex || props.symbolType === MarketType.Forex"
		:ticker="ticker"
		:size="size"
		:src="[src, rightSrc]"
		:disable-glow="disableGlow"
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
		:src="src"
		:ticker="ticker?.[0]"
		:size="size"
		:disable-glow="props.disableGlow"
	>
		<template #glow v-if="$slots.glow">
			<slot name="glow" />
		</template>
	</ticker-icon>
</template>
