<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import {
	ModalBadge,
} from '@/modules/widgets/base';
import { getMarketLabel, type MarketType } from '@/modules/market';

import MarketBadgeList from './market-badge-list.vue';

interface IMarketBadgeProps {
	title?: string;
	excludeMarkets?: MarketType[];
}

const props = withDefaults(defineProps<IMarketBadgeProps>(), {
	title: 'Market',
	excludeMarkets: () => [],
});

const activeMarket = defineModel<MarketType>({ required: true });
</script>

<template>
	<modal-badge>
		<template #title>
			{{ getMarketLabel(activeMarket) }}
			<ui-icon :id="IconIds.DropdownDown" />
		</template>

		<template #content>
			<market-badge-list
				v-model="activeMarket"
				:title="props.title"
				:exclude-markets="props.excludeMarkets"
			/>
		</template>
	</modal-badge>
</template>
