<script setup lang="ts">
import { reactive } from 'vue';

import {
	BaseWidgetDashboard,
	WidgetFiltersScrollable,
	BaseErrorComponent,
} from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import {
	useCalendarState,
	CalendarCategoriesBadgeModal,
	CalendarCountryBadgeModal,
	CalendarImpactBadgeModal,
	DashboardEventBoard,
	useInfiniteQueryEventBoard,
	localDateToUTCUnix,
} from '@/modules/calendar-new';

import CalendarLoader from '../views/calendar-loader.vue';

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	currentTime,
	selectedCategories,
	selectedCountries,
	selectedImpacts,
	resetAll,
	refetch,
} = useCalendarState({
	widget: {
		widgetId: props.meta.widgetId,
		isEphemeral: props.meta.isOpenFull,
	},
});

const query = reactive(useInfiniteQueryEventBoard(() => ({
	from: localDateToUTCUnix(currentTime.value),
	categories: selectedCategories.value,
	countries: selectedCountries.value,
	minImpact: selectedImpacts.value,
})));
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@retry="refetch"
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
				:event-board="query.data.days"
				:is-fetching-next="query.isFetchingNextPage"
				:is-fetching-prev="query.isFetchingPreviousPage"
				@load-next="query.fetchNextPage"
				@load-prev="query.fetchPreviousPage"
			/>

			<base-error-component v-else @retry="query.refetch" />
		</template>
	</base-widget-dashboard>
</template>
