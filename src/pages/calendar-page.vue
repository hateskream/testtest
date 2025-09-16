<script setup lang="ts">
import { LayoutComponent } from '@/modules/layout';
import { CalendarLayout } from '@/modules/calendar';
import { CalendarWeeklyInfo, CalendarComponent, CalendarToolbar, CalendarEventBoard } from '@/modules/calendar/ui';
import { NewsDashboard } from '@/modules/widgets/news';
// FIXME: remove this import
import type { IMarketSettings } from '@/modules/treemap/model';

const market = defineModel<IMarketSettings>('market', { required: true });
</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #header>
			<div :class="classes.header">Calendar</div>
		</template>
		<template #content>
			<calendar-layout>
				<template #content>
					<calendar-toolbar :market="market" />

					<calendar-weekly-info />

					<calendar-event-board />
				</template>

				<template #calendar-sidebar>
					<calendar-component />

					<!-- TODO: after refactoring widget system to reusable modules,
						we can replace this with module instead of full widget -->
					<news-dashboard
						:meta="{
							name: '',
							isResizing: false,
							widgetId: 'news',
							market: 'crypto',
							size: { h: 1, w: 1 },
							defaultStateType: 'normal'
						}"
					/>
				</template>
			</calendar-layout>
		</template>
	</layout-component>
</template>

<style module="classes">
.header {
	font-style: normal;
	font-weight: 340;
	font-size: 36px;
	line-height: 100%;
	color: var(--text-color-base-500);
}

</style>
