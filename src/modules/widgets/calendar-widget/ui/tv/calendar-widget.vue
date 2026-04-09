<script setup lang="ts">
import { computed, defineAsyncComponent, reactive, ref } from 'vue';

import { BaseErrorComponent, BaseWidgetTvComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import {
	getUTCWeekRange,
	localDateToUTCUnix,
	useCalendar,
	useEventBoardClientFiltration,
	useInfiniteQueryEventBoard,
} from '@/modules/calendar';

import CalendarLoader from '../views/calendar-loader.vue';

const CalendarMain = defineAsyncComponent({
	loader: () => import('../views/calendar-view.vue'),
	loadingComponent: CalendarLoader,
	errorComponent: BaseErrorComponent,
});

const props = defineProps<{
	meta: IMeta;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const {
	currentTime,
	selectedCategories,
	selectedCountries,
	selectedImpacts,
	resetAll,
} = useCalendar({
	widget: {
		widgetId: props.meta.widgetId,
		isEphemeral: props.meta.isOpenFull,
	},
});

const limit = ref(getUTCWeekRange(new Date(localDateToUTCUnix(currentTime.value) * 1000)));

const initialFrom = computed(() => {
	const today = localDateToUTCUnix(currentTime.value);
	const { from, to } = limit.value;
	return today >= from && today <= to ? today : from;
});

const query = reactive(useInfiniteQueryEventBoard(() => ({
	from: initialFrom.value,
	categories: selectedCategories.value,
	countries: selectedCountries.value,
	minImpact: selectedImpacts.value,
	limit: {
		from: limit.value.from,
		to: limit.value.to,
	},
})));

const { filteredData } = useEventBoardClientFiltration({
	data: () => query.data,
	categories: () => selectedCategories.value,
	countries: () => selectedCountries.value,
	impacts: () => selectedImpacts.value,
});

const filteredDays = computed(() => filteredData.value?.days ?? []);
</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="resetAll"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@retry="query.refetch"
	>
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<calendar-loader v-if="query.isLoading" />

			<calendar-main
				v-else-if="query.data && !query.isError"
				v-model:countries="selectedCountries"
				v-model:categories="selectedCategories"
				v-model:impact="selectedImpacts"
				v-model:range="limit"
				:event-board="filteredDays"
				:current-time="currentTime"
				:is-fetching-next="query.isFetchingNextPage"
				:is-fetching-prev="query.isFetchingPreviousPage"
				@load-next="query.fetchNextPage"
				@load-prev="query.fetchPreviousPage"
				@reset="resetAll"
			/>

			<base-error-component
				v-else
				@retry="query.refetch"
			/>
		</template>
	</base-widget-tv-component>
</template>
