<script setup lang="ts">
import type { PricePerformance } from '../../../model';
import type { ITickerWidgetMeta } from '@/modules/ticker';

import BasePricePerformance
	from './base-price-performance.vue';


interface IProps {
	data: PricePerformance;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();


</script>

<template>
	<base-price-performance :data="props.data" :meta="props.meta" />
</template>

<style module="classes">

</style>
