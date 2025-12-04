<script setup lang="ts">
import { computed } from 'vue';

import {
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { getAllMarkets, type MarketType } from '@/modules/market';

interface IMarketBadgeProps {
	title: string;
	excludeMarkets?: MarketType[];
	displayVariant: 'new' | 'default';
}

const props = withDefaults(defineProps<IMarketBadgeProps>(), {
	excludeMarkets: () => [],
});

const activeMarket = defineModel<MarketType>({ required: true });

const markets = computed(() => getAllMarkets().filter((market) => !props.excludeMarkets.includes(market.type)));

function updateMarket(market: MarketType) {
	activeMarket.value = market;
}
</script>

<template>
	<modal-badge-list :display-variant>
		<template #title>{{ props.title }}</template>

		<template v-for="market in markets" :key="market.type">
			<modal-item-selector
				:model-value="activeMarket === market.type"
				@update:model-value="updateMarket(market.type)"
			>
				{{ market.label }}
			</modal-item-selector>
		</template>
	</modal-badge-list>
</template>
