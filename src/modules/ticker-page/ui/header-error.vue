<script setup lang="ts">
import { computed } from 'vue';

import { UiText } from '@/shared/ui/text';
import { ErrorNetworkComponent } from '@/modules/widgets/base/common';
import { MarketType } from '@/modules/market';
import { TickerIcon } from '@/shared/ui/ticker';
import { UiTag } from '@/shared/ui/tag';
import { UiSkeleton } from '@/shared/ui/skeleton';

import TickerHeaderLayout from './components/header/ticker-header-layout.vue';

const props = defineProps<{
	tickerId: string;
}>();

const emit = defineEmits<{
	retry: [];
	onTickerSelect: [string];
}>();

const mockTicker = computed(() => {
	const dashIndex = props.tickerId.indexOf('-');
	const market = dashIndex > -1 ? props.tickerId.slice(0, dashIndex) : props.tickerId;
	const symbol = dashIndex > -1 ? props.tickerId.slice(dashIndex + 1) : props.tickerId;
	return {
		symbol: symbol || props.tickerId,
		name: symbol || props.tickerId,
		canonical_ticker_id: props.tickerId,
		market_type: (market as MarketType) || MarketType.Stock,
	};
});
</script>

<template>
	<ticker-header-layout
		:ticker="mockTicker"
		@on-ticker-select="emit('onTickerSelect', $event)"
	>
		<template #logo>
			<ticker-icon
				:size="56"
				:ticker="mockTicker.symbol"
				disable-glow
			/>
		</template>

		<template #ticker-name>
			{{ mockTicker.symbol }}
		</template>

		<template #badges>
			<ui-tag>
				<div :class="classes.skeletonPlaceholder" />
			</ui-tag>
			<ui-tag>
				<template #icon>
					<ui-skeleton
						width="16px"
						height="16px"
						shape="circle"
					/>
				</template>
			</ui-tag>
		</template>

		<template #price>
			<ui-text token="title-200">$ —</ui-text>
		</template>

		<template #actions>
			<error-network-component @retry="emit('retry')" />
		</template>
	</ticker-header-layout>
</template>

<style module="classes">
/** use 5ch for dynamic fonts **/
.skeletonPlaceholder {
	width: 5ch;
	visibility: hidden;
}
</style>
