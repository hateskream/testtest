<script setup lang="ts">
import {
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { getAllMarkets, type MarketType } from '@/modules/market';

interface IMarketBadgeProps {
	title: string;
}

const props =defineProps<IMarketBadgeProps>();

const activeMarket = defineModel<MarketType>({ required: true });

function updateMarket(market: MarketType) {
	activeMarket.value = market;
}
</script>

<template>
	<modal-badge-list>
		<template #title>{{ props.title }}</template>

		<template v-for="market in getAllMarkets()" :key="market.type">
			<modal-item-selector
				:model-value="activeMarket === market.type"
				@update:model-value="updateMarket(market.type)"
			>
				{{ market.label }}
			</modal-item-selector>
		</template>
	</modal-badge-list>
</template>
