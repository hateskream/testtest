<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

import { LayoutComponent } from '@/modules/layout';
import { CalendarLayout, EventType, Impact, type IToolbarUserState, markets } from '@/modules/calendar';
import { CalendarComponent, CalendarEventBoard, CalendarToolbar, CalendarWeeklyInfo } from '@/modules/calendar/ui';
import { NewsDashboard } from '@/modules/widgets/news';
import { generateRandomColor } from '@/shared/lib';
import type { IWeeklyDayInfo } from '@/modules/calendar/types/calendar.ts';

const toolbarState = reactive<IToolbarUserState>({
	market: markets[0],
	impact: Impact.All,
	eventType: EventType.All,
});

interface ICalendarWeeklyContainerProps {
	locale?: string;
	weekStartsOn?: 'monday' | 'sunday';
	initialDate?: Date | string | number;
}

const props = withDefaults(defineProps<ICalendarWeeklyContainerProps>(), {
	locale: 'en-US',
	weekStartsOn: 'monday',
	initialDate: () => new Date(),
});

const baseDate = ref(new Date(props.initialDate));
const selectedDate = ref(new Date(baseDate.value));

const shortFormatter = computed(
	() => new Intl.DateTimeFormat(props.locale, { weekday: 'short' }),
);
const longFormatter = computed(
	() => new Intl.DateTimeFormat(props.locale, { weekday: 'long' }),
);

function getStartOfWeek(date: Date): Date {
	const jsDayOfWeek = date.getDay();
	const startOffset = props.weekStartsOn === 'monday' ? (jsDayOfWeek + 6) % 7 : jsDayOfWeek;
	const start = new Date(date);
	start.setHours(0, 0, 0, 0);
	start.setDate(date.getDate() - startOffset);
	return start;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function isSameWeek(a: Date, b: Date): boolean {
	const startA = getStartOfWeek(a);
	const startB = getStartOfWeek(b);
	return isSameCalendarDay(startA, startB);
}

const today = new Date();

const weekDays = computed<IWeeklyDayInfo[]>(() => {
	const startOfWeek = getStartOfWeek(baseDate.value);

	return Array.from({ length: 7 }, (_, index) => {
		const d = new Date(startOfWeek);
		d.setDate(startOfWeek.getDate() + index);

		return {
			date: d,
			dayNumber: d.getDate(),
			weekdayShort: shortFormatter.value.format(d),
			weekdayLong: longFormatter.value.format(d),
			isToday: isSameCalendarDay(d, today),
			isCurrentWeek: isSameWeek(baseDate.value, today),
			metrics: [
				{ label: 'Economic', value: Math.round(Math.random() * 100) },
				{ label: 'Earnings', value: Math.round(Math.random() * 100) },
				{ label: 'Dividends', value: Math.round(Math.random() * 1000) },
			],
			colorDots:
				Math.random() > 0.7 ? [{ color: generateRandomColor() }] :
					Math.random() > 0.7 ? [{ color: generateRandomColor() }, { color: generateRandomColor() }] : [],
		};
	});
});

function setSelected(date: Date) {
	selectedDate.value = new Date(date);
	baseDate.value = new Date(date);
}

function prevWeek() {
	const d = new Date(baseDate.value);
	d.setDate(d.getDate() - 7);
	baseDate.value = d;
}

function nextWeek() {
	const d = new Date(baseDate.value);
	d.setDate(d.getDate() + 7);
	baseDate.value = d;
}
</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #header>
			<div :class="classes.header">Calendar</div>
		</template>
		<template #content>
			<calendar-layout>
				<template #content>
					<calendar-toolbar
						v-model:state="toolbarState"
						v-model:selected-date="selectedDate"
						:markets="markets"
						:event-types="Object.values(EventType)"
						:impacts="Object.values(Impact)"
						:week-days="weekDays"
						:locale="props.locale"
						@next-week="nextWeek"
						@prev-week="prevWeek"
					/>

					<calendar-weekly-info
						:week-days="weekDays"
						:selected-date="selectedDate"
						@select-day="setSelected"
					/>

					<calendar-event-board />
				</template>

				<template #calendar-sidebar>
					<calendar-component
						v-model="selectedDate"
						@update-week="setSelected"
					/>

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
	font-size: 32px;
	line-height: 100%;
	color: var(--text-color-base-500);
}

</style>
