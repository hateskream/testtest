<script setup lang="ts">
import { ref } from 'vue'

import type { IMeta } from '@/modules/dashboard-group/model';
import { BaseDashboardComponent } from '../../base/index.ts';

import MainView from './view/main-view.vue';
import ErrorView from './view/error-view.vue';
import LoaderView from './view/loader-view.vue';

const props = defineProps<{
	meta: IMeta;
}>()

// TODO: Make them real
const isLoading = ref(true)
const isDataLoadingError = ref(false)
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
			<error-view v-else-if="isDataLoadingError" />

			<main-view v-else />
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
