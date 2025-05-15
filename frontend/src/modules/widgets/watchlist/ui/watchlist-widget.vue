<script setup lang="ts">
import { onMounted } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/model';
import { BaseDashboardComponent } from '../../base/index.ts';
import { useQueryMarket } from '../../market/queries/index.ts';
import { useMarketStore } from '../../market/stores/index.ts';

import MainView from './view/main-view.vue';
import ErrorView from './view/error-view.vue';
import LoaderView from './view/loader-view.vue';

const props = defineProps<{
	meta: IMeta;
}>();

// TODO: Make them real
// const isLoading = ref(false);
// const isDataLoadingError = ref(false);

const reloadDataHandler = () => {
	// // TODO: Make it real or remove
	// // isLoading.value = true;
	// isDataLoadingError.value = false;

	// setTimeout(() => {
	// 	// isLoading.value = false;
	// 	isDataLoadingError.value = false;
	// }, 2000);
};

const marketStore = useMarketStore();
const { data, isLoading, isError } = useQueryMarket({
	market: props.meta.market,
	sort: marketStore.activeTabSort.sortTab,
});
// TODO: Remove
onMounted(() => {
	// isLoading.value = true;

	// setTimeout(() => {
	// 	isLoading.value = false;
	// 	isDataLoadingError.value = true;
	// }, 2000);
});
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<div class="title-container">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<loader-view v-if="isLoading" />
			<error-view
				v-else-if="isError"
				@click="reloadDataHandler"
			/>

			<main-view v-else :markets="data || []" />
		</template>
	</base-dashboard-component>
</template>

<style module>
.title-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}
</style>
