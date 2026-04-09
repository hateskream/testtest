<script setup lang="ts">
import { computed, reactive } from 'vue';

import {
	BaseErrorComponent,
	BaseWidgetDashboard,
	useWidgetState,
	WidgetFiltersScrollable,
} from '@/modules/widgets/base';
import { type IMeta, useWidgetContext } from '@/modules/dashboard-group';
import type { IState } from '@/modules/calendar';
import {
	CalendarCategoriesBadgeModal,
	CalendarCountryBadgeModal,
	CalendarImpactBadgeModal,
	DashboardEventBoard,
	getDefaultsState,
	localDateToUTCUnix,
	useCalendarState,
	useEventBoardClientFiltration,
	useInfiniteQueryEventBoard,
} from '@/modules/calendar';

import CalendarLoader from '../views/calendar-loader.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const { updateState } = useWidgetContext();

const { state } = useWidgetState<IState>({
	externalState: computed(() => props.meta.state as IState | undefined),
	getDefaultState: () => getDefaultsState(),
	onStateChange: (s) => updateState(s),
});

const {
	currentTime,
	selectedCategories,
	selectedCountries,
	selectedImpacts,
	resetAll,
} = useCalendarState({ state });

const query = reactive(useInfiniteQueryEventBoard(() => ({
	from: localDateToUTCUnix(currentTime.value),
	categories: selectedCategories.value,
	countries: selectedCountries.value,
	minImpact: selectedImpacts.value,
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
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@retry="query.refetch"
	>
		<template #filters>
			<widget-filters-scrollable
				display-variant="new"
				@on-clear-click="resetAll"
			>
				<calendar-country-badge-modal v-model="selectedCountries" display-variant="new" />
				<calendar-categories-badge-modal v-model="selectedCategories" display-variant="new" />
				<calendar-impact-badge-modal v-model="selectedImpacts" display-variant="new" />
			</widget-filters-scrollable>
		</template>
		<template #content>
			<calendar-loader v-if="query.isLoading" />

			<dashboard-event-board
				v-else-if="query.data && !query.isError"
				:current-time="currentTime"
				:event-board="filteredDays"
				:is-fetching-next="query.isFetchingNextPage"
				:is-fetching-prev="query.isFetchingPreviousPage"
				@load-next="query.fetchNextPage"
				@load-prev="query.fetchPreviousPage"
				@reset="resetAll"
			/>

			<base-error-component v-else @retry="query.refetch" />
		</template>
	</base-widget-dashboard>
</template>
