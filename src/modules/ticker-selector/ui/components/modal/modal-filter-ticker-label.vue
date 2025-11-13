<script setup lang="ts">
import { computed } from 'vue';

import { isCryptoTicker, isForexTicker, type ITickerMapped } from '@/modules/ticker-selector/model';

interface IModalFilterTickerLabelProps {
	ticker: ITickerMapped;
}

const props = defineProps<IModalFilterTickerLabelProps>();

const preparedLabel = computed(() => {
	if (isCryptoTicker(props.ticker) || isForexTicker(props.ticker)) {
		return props.ticker.ticker;
	}

	return props.ticker.name;
});
</script>

<template>
	<span>{{ preparedLabel }}</span>
</template>
