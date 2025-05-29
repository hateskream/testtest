<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useChartStore } from '@/modules/chart/store';
import { ChartCommonPriceInfo } from '@/modules/chart/components/shared';
import { breadCrumbsData } from './components/breadcrumbs/models';
import { ChartHeaderBreadcrumbs, ChartHeaderStockInfo } from './components';
import { ChartHeaderLayout, ChartHeaderTickerImageItem } from './ui';


const { bgColor, bgColorShadow } = storeToRefs(useChartStore());
</script>


<template>
	<chart-header-layout>
		<template #logo>
			<chart-header-ticker-image-item :fill="bgColor" :shadow="bgColorShadow" />
		</template>
		<template #market>
			<chart-header-breadcrumbs :bread-crumbs-data="breadCrumbsData" />
			<chart-header-stock-info />
		</template>
		<template #price>
			<chart-common-price-info />
		</template>
	</chart-header-layout>
</template>

<style module="classes">

</style>
