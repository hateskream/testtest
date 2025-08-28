<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useChartStore } from '@/modules/chart/store';
import { ChartCommonPriceInfo } from '@/modules/chart/components/shared';
import { breadCrumbsData } from './components/breadcrumbs/models';
import { ChartHeaderBreadcrumbs, ChartHeaderStockInfo } from './components';
import { ChartHeaderLayout, ChartHeaderTickerImageItemTesla, ChartHeaderTickerImageItemBitcoin } from './ui';

import ChartHeaderTickerImageItemSpdr
	from '@/modules/chart/components/header/ui/chart-header-ticker-image-item-spdr.vue';


const { bgColor, bgColorShadow } = storeToRefs(useChartStore());

interface IChartHeaderProps {
	type: string;
}

const props = defineProps<IChartHeaderProps>();

const tickerName = computed(()=>{
	if (props.type === 'stock') {
		return 'Tesla';
	}
	if (props.type === 'etf') {
		return 'DIA ETF Trust';
	}
	return 'Bitcoin';
});


</script>


<template>
	<chart-header-layout>
		<template #logo>
			<chart-header-ticker-image-item-tesla
				v-if="props.type === 'stock'"
				:fill="bgColor"
				:shadow="bgColorShadow"
			/>
			<chart-header-ticker-image-item-spdr
				v-else-if="props.type === 'etf'"
				:fill="bgColor"
				:shadow="bgColorShadow"
			/>
			<chart-header-ticker-image-item-bitcoin
				v-else
				:fill="bgColor"
				:shadow="bgColorShadow"
			/>
		</template>
		<template #market>
			<chart-header-breadcrumbs :bread-crumbs-data="breadCrumbsData" />
			<chart-header-stock-info :ticker-name="tickerName" />
		</template>
		<template #price>
			<chart-common-price-info />
		</template>
	</chart-header-layout>
</template>

<style module="classes">

</style>
