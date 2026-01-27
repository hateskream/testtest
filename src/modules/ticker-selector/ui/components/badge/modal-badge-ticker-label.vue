<script setup lang="ts">
import { computed } from 'vue';

import { type ITickerItem } from '../../../model';
import { UiText } from '@/shared/ui/text';
import { MarketType } from '@/modules/market';

interface IModalFilterTickerLabelProps {
	ticker: ITickerItem;
}

const props = defineProps<IModalFilterTickerLabelProps>();

const preparedLabel = computed(() => {
	if (props.ticker.market_type === MarketType.Forex) {
		return props.ticker.name;
	}

	return props.ticker.symbol;
});
</script>

<template>
	<ui-text token="text-200-r">
		{{ preparedLabel }}
	</ui-text>
</template>

<style module="classes">

</style>
