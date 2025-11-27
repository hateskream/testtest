<script setup lang="ts">
import { computed } from 'vue';

import { type IMarketMapped } from '../../../model';
import { marketToLabel } from '@/modules/market';

interface IModalFilterMarketLabelProps {
	market: IMarketMapped;
}

const props = defineProps<IModalFilterMarketLabelProps>();

const preparedLabel = computed(() => marketToLabel[props.market.marketType]);
</script>

<template>
	<span>{{ preparedLabel }}</span>
</template>
