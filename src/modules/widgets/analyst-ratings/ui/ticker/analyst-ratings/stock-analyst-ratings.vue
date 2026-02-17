<script setup lang="ts">
import type { AnalystRatings } from '../../../model';
import type { ITickerWidgetMeta } from '@/modules/ticker';

import BasePricePerformance
	from './base-analyst-ratings.vue';


interface IProps {
	data: AnalystRatings;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();


</script>

<template>
	<base-price-performance :data="props.data" :meta="props.meta" />
</template>

<style module="classes">

</style>
