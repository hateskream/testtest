<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent } from '../../base';
import { useQueryPrice } from '../queries';

import ErrorComponent from './error-component.vue';
import PreloaderComponent from './preloader-component.vue';
import ViewComponent from './view-component.vue';
import RcmPriceComponent from './rcm-price-component.vue';

interface IDashboardComponentProps {
	market: string;
}

const props = defineProps<IDashboardComponentProps>();

const { data, isLoading, isError } = useQueryPrice(props.market);

const isNotData = computed(() => !!data.value && isLoading.value);
</script>

<template>
	<base-dashboard-component :class="classes.root">
		<template #title> Price </template>
		<template #content>
			<error-component v-if="isError" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				:currencies="data"
			/>
		</template>
		<template #rcm="{ positions }">
			<rcm-price-component :positions="positions" />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.root {
	flex-grow: 1.8;
	flex-basis: 0;
}
</style>
