<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base';
import { useQueryPrice } from '../queries';
import type { IMeta } from '@/modules/dashboard-group/model';

import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';
import RcmPriceComponent from './rcm-price-component.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const { data, isLoading, isError } = useQueryPrice(props.meta.market);

const isNotData = computed(() => !!data.value && isLoading.value);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title> {{ props.meta.name }} </template>
		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				:meta="meta"
			/>
		</template>
		<template #rcm>
			<rcm-price-component />
		</template>
	</base-dashboard-component>
</template>
