<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';

import { BaseErrorComponent, BaseTickerWidgetError } from '@/modules/widgets/base';
import { useQueryNominalGdp } from '../../queries';
import { calculateGrowthYoy, NominalGdpDateRangePreset, type NominalGdpDateRangePresetType } from '../../model';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

const activeRange = ref<NominalGdpDateRangePresetType>(NominalGdpDateRangePreset.TenYears);

const {
	data,
	isLoading,
	isError,
	refetch,
} = useQueryNominalGdp(activeRange);

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
