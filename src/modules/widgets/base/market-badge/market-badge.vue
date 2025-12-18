<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { ModalBadgeDropdown } from '@/modules/widgets/base';
import { getMarketLabel, type MarketType } from '@/modules/market';

import MarketBadgeList from './market-badge-list.vue';

interface IMarketBadgeProps {
	title?: string;
	excludeMarkets?: MarketType[];
	displayVariant?: 'default' | 'new';
	closeOnSelect?: boolean;
}

const props = withDefaults(defineProps<IMarketBadgeProps>(), {
	title: 'Market',
	excludeMarkets: () => [],
	displayVariant: 'default',
});

const activeMarket = defineModel<MarketType>({ required: true });

const dropdownRef = useTemplateRef('dropdown');

function closeDropdown() {
	dropdownRef.value?.close?.();
}

function onUpdateMarket(market: MarketType) {
	if (activeMarket.value !== market && props.closeOnSelect) {
		closeDropdown();
	}
}
</script>

<template>
	<modal-badge-dropdown ref="dropdown" :display-variant="props.displayVariant">
		<template #title>
			{{ getMarketLabel(activeMarket) }}
		</template>

		<template #content>
			<market-badge-list
				v-model="activeMarket"
				:title="props.title"
				:exclude-markets="props.excludeMarkets"
				:display-variant
				@update:model-value="onUpdateMarket"
			/>
		</template>
	</modal-badge-dropdown>
</template>
