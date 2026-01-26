<script setup lang="ts">
import { defineAsyncComponent, computed, reactive, ref } from 'vue';

import { BaseErrorComponent, BaseWidgetTvComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import {
	getUTCWeekRange,
	toUTCMidnightUnix,
	useCalendarState,
	useInfiniteQueryEventBoard,
} from '@/modules/calendar-new';

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
} = useCalendarState({
	widget: {
		widgetId: props.meta.widgetId,
		isEphemeral: props.meta.isOpenFull,
	},
});

const limit = ref(getUTCWeekRange(currentTime.value));

const initialFrom = computed(() => {
	const today = toUTCMidnightUnix(currentTime.value);
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
</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="resetAll"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@retry="refetch"
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
				:event-board="query.data.days"
				:current-time="currentTime"
				:is-fetching-next="query.isFetchingNextPage"
				:is-fetching-prev="query.isFetchingPreviousPage"
				@load-next="query.fetchNextPage"
				@load-prev="query.fetchPreviousPage"
			/>

			<base-error-component
				v-else
				@retry="query.refetch"
			/>
		</template>
	</base-widget-tv-component>
</template>
