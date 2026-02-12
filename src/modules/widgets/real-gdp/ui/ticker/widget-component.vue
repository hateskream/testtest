<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';

import { BaseErrorComponent, BaseTickerWidgetError } from '@/modules/widgets/base';
import { useQueryRealGdp } from '../../queries';
import {
	calculateGrowthYoy,
	RealGdpDateRangePreset,
	type RealGdpDateRangePresetType,
	RealGdpValueType,
	type RealGdpValueTypeType,
} from '../../model';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

const activeRange = ref<RealGdpDateRangePresetType>(RealGdpDateRangePreset.TenYears);
const valueType = ref<RealGdpValueTypeType>(RealGdpValueType.Points);

const {
	data,
	isLoading,
	isError,
	refetch,
} = useQueryRealGdp(activeRange);

const growthYoy = computed(() => {
	if (data.value) {
		return calculateGrowthYoy(data.value.points);
	}

	return null;
});
</script>

<template>
	<div :class="classes.container">
		<base-ticker-widget-error v-if="isError" @retry="refetch" />
		<preloader-component v-if="isLoading" />
		<view-component
			v-else-if="data && growthYoy"
			v-model:active-range="activeRange"
			v-model:value-type="valueType"
			:data="data"
			:growth-yoy="growthYoy"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
}


</style>
