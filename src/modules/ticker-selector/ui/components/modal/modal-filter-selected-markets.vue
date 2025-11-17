<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { getMappedMarket, type IMarketMapped } from '../../../model';
import type { MarketType } from '@/modules/market';

import ModalFilterMarketItem from './modal-filter-market-item.vue';

export interface IModalFilterSelectedMarketsProps {
	selectedMarkets: MarketType[];
}

const props = defineProps<IModalFilterSelectedMarketsProps>();

interface IEmits {
	(e: 'toggle-market', market: MarketType): void;
}

const emit = defineEmits<IEmits>();

const mappedMarkets = ref<IMarketMapped[]>([]);

onBeforeMount(() => {
	mappedMarkets.value = props.selectedMarkets.map(getMappedMarket);
});
</script>

<template>
	<div :class="classes.column">
		<modal-filter-market-item
			v-for="market in mappedMarkets"
			:key="market.marketType"
			:label="market.label"
			:icon="market.icon"
			:is-selected="selectedMarkets.includes(market.marketType)"
			@update="emit('toggle-market', market.marketType)"
		/>
	</div>
</template>

<style module="classes">
.column {
	display: flex;
	flex-direction: column;
}
</style>
