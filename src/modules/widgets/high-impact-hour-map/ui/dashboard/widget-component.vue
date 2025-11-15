<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { PreloaderComponent, FiltersPanel } from '../common';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/main-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emits = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const isError = false;
const isLoading = false;
const refetch = () => {};


enum TimeZoneUTC {
	UTCm12 = 'UTC-12:00',
	UTCm11 = 'UTC-11:00',
	UTCm10 = 'UTC-10:00',
	UTCm930 = 'UTC-09:30',
	UTCm9 = 'UTC-09:00',
	UTCm8 = 'UTC-08:00',
	UTCm7 = 'UTC-07:00',
	UTCm6 = 'UTC-06:00',
	UTCm5 = 'UTC-05:00',
	UTCm4 = 'UTC-04:00',
	UTCm330 = 'UTC-03:30',
	UTCm3 = 'UTC-03:00',
	UTCm2 = 'UTC-02:00',
	UTCm1 = 'UTC-01:00',
	UTC0 = 'UTC+00:00',
	UTCp1 = 'UTC+01:00',
	UTCp2 = 'UTC+02:00',
	UTCp3 = 'UTC+03:00',
	UTCp330 = 'UTC+03:30',
	UTCp4 = 'UTC+04:00',
	UTCp430 = 'UTC+04:30',
	UTCp5 = 'UTC+05:00',
	UTCp530 = 'UTC+05:30',
	UTCp545 = 'UTC+05:45',
	UTCp6 = 'UTC+06:00',
	UTCp630 = 'UTC+06:30',
	UTCp7 = 'UTC+07:00',
	UTCp8 = 'UTC+08:00',
	UTCp845 = 'UTC+08:45',
	UTCp9 = 'UTC+09:00',
	UTCp930 = 'UTC+09:30',
	UTCp10 = 'UTC+10:00',
	UTCp1030 = 'UTC+10:30',
	UTCp11 = 'UTC+11:00',
	UTCp12 = 'UTC+12:00',
	UTCp1245 = 'UTC+12:45',
	UTCp13 = 'UTC+13:00',
	UTCp14 = 'UTC+14:00',
}

const timeZone = ref(TimeZoneUTC.UTC0);

const timeZoneDisplay: Record<TimeZoneUTC, string> = {
	[TimeZoneUTC.UTCm12]: 'UTC-12:00',
	[TimeZoneUTC.UTCm11]: 'UTC-11:00',
	[TimeZoneUTC.UTCm10]: 'UTC-10:00',
	[TimeZoneUTC.UTCm930]: 'UTC-09:30',
	[TimeZoneUTC.UTCm9]: 'UTC-09:00',
	[TimeZoneUTC.UTCm8]: 'UTC-08:00',
	[TimeZoneUTC.UTCm7]: 'UTC-07:00',
	[TimeZoneUTC.UTCm6]: 'UTC-06:00',
	[TimeZoneUTC.UTCm5]: 'UTC-05:00',
	[TimeZoneUTC.UTCm4]: 'UTC-04:00',
	[TimeZoneUTC.UTCm330]: 'UTC-03:30',
	[TimeZoneUTC.UTCm3]: 'UTC-03:00',
	[TimeZoneUTC.UTCm2]: 'UTC-02:00',
	[TimeZoneUTC.UTCm1]: 'UTC-01:00',
	[TimeZoneUTC.UTC0]: 'UTC+00:00',
	[TimeZoneUTC.UTCp1]: 'UTC+01:00',
	[TimeZoneUTC.UTCp2]: 'UTC+02:00',
	[TimeZoneUTC.UTCp3]: 'UTC+03:00',
	[TimeZoneUTC.UTCp330]: 'UTC+03:30',
	[TimeZoneUTC.UTCp4]: 'UTC+04:00',
	[TimeZoneUTC.UTCp430]: 'UTC+04:30',
	[TimeZoneUTC.UTCp5]: 'UTC+05:00',
	[TimeZoneUTC.UTCp530]: 'UTC+05:30',
	[TimeZoneUTC.UTCp545]: 'UTC+05:45',
	[TimeZoneUTC.UTCp6]: 'UTC+06:00',
	[TimeZoneUTC.UTCp630]: 'UTC+06:30',
	[TimeZoneUTC.UTCp7]: 'UTC+07:00',
	[TimeZoneUTC.UTCp8]: 'UTC+08:00',
	[TimeZoneUTC.UTCp845]: 'UTC+08:45',
	[TimeZoneUTC.UTCp9]: 'UTC+09:00',
	[TimeZoneUTC.UTCp930]: 'UTC+09:30',
	[TimeZoneUTC.UTCp10]: 'UTC+10:00',
	[TimeZoneUTC.UTCp1030]: 'UTC+10:30',
	[TimeZoneUTC.UTCp11]: 'UTC+11:00',
	[TimeZoneUTC.UTCp12]: 'UTC+12:00',
	[TimeZoneUTC.UTCp1245]: 'UTC+12:45',
	[TimeZoneUTC.UTCp13]: 'UTC+13:00',
	[TimeZoneUTC.UTCp14]: 'UTC+14:00',
};

</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@delete="emits('delete')"
		@duplicate="emits('duplicate')"
		@move-to="emits('moveTo', $event)"
	>
		<template #filters>
			<filters-panel
				v-model:date-range="timeZone"
				display-variant="new"
				:data-ranges="Object.values(TimeZoneUTC)"
				:display-value-data-range="timeZoneDisplay"
			/>
		</template>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else
			/>
		</template>
	</base-widget-dashboard>
</template>
