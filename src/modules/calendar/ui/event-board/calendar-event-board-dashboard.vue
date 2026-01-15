<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';

import {
	type DateYYYYMMDD,
	type ICalendarEvent,
	type IEventBoardItem,
	toIsoUtcDate,
	toUtcIsoDate,
} from '@/modules/calendar';
import { getHighlightColor } from '@/modules/calendar/models/colors.ts';
import { getDateFormatter } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';

import CalendarEventCardDashboard from './calendar-event-card-dashboard.vue';

interface ICalendarEventBoardProps {
	eventBoard: IEventBoardItem[];
	eventBoardFavorites: string[];
	maxCountRowTable: number;
}

const props = defineProps<ICalendarEventBoardProps>();
const emits = defineEmits<{
	toggleEventBoard: [id: string];
}>();

const boardsRef = ref<HTMLElement[]>([]);

const now = new Date();

function formatEventDate(dateStr: DateYYYYMMDD) {
	const date = new Date(dateStr);
	const locale = 'en-US';

	const sameYear = date.getFullYear() === now.getFullYear();
	const sameMonth = sameYear && date.getMonth() === now.getMonth();

	const weekdayFormatter = getDateFormatter({
		locale,
		weekday: 'short',
	});

	const dayFormatter = getDateFormatter({
		locale,
		day: 'numeric',
	});

	const weekday = weekdayFormatter.format(date);
	const day = dayFormatter.format(date);

	if (sameMonth) {
		return `${weekday} ${day}`;
	} else if (sameYear) {
		const monthFormatter = getDateFormatter({
			locale,
			month: 'long',
		});

		const month = monthFormatter.format(date);

		return `${month}, ${weekday} ${day}`;
	} else {
		const monthFormatter = getDateFormatter({
			locale,
			month: 'long',
		});

		const yearFormatter = getDateFormatter({
			locale,
			year: 'numeric',
		});

		const month = monthFormatter.format(date);
		const year = yearFormatter.format(date);

		return `${month} ${year}, ${weekday} ${day}`;
	}
}

const HOUR = 60 * 60 * 1000;

function groupEventsByHour(events: ICalendarEvent[]) {
	const groups: Record<string, ICalendarEvent[]> = {};

	for (const ev of events) {
		if (!ev.meta.datetime) {
			continue;
		}

		const date = new Date(ev.meta.datetime);
		const hour = date.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});

		(groups[hour] ??= []).push(ev);
	}

	return Object.entries(groups)
		.sort(([a], [b]) => (a > b ? 1 : -1))
		.map(([hour, e]) => ({ hour, events: e }));
}

function getHourStatus(dayDate: DateYYYYMMDD, hour: string) {
	const [hh, mm = '0'] = hour.split(':');

	const start = toIsoUtcDate(dayDate);
	start.setHours(Number(hh), Number(mm), 0, 0);

	const diff = start.getTime() - now.getTime();

	return {
		soon: diff > 0 && diff <= HOUR,
		missed: diff <= 0,
	};
}

const groupedBoard = computed(() =>
	props.eventBoard.map(day => {
		const grouped = groupEventsByHour(day.events).map(group => ({
			...group,
			...getHourStatus(day.date as DateYYYYMMDD, group.hour),
			events: group.events.map(event => ({
				...event,
				favorite: props.eventBoardFavorites.includes(event.id),
			})),
		}));

		return { ...day, grouped };
	}),
);

const containerRef = useTemplateRef('container');

function scrollToDate(
	date: DateYYYYMMDD,
	param: ScrollIntoViewOptions = {},
) {
	const scroller = containerRef.value;
	if (!scroller) {
		return;
	}

	const behavior = (param.behavior as ScrollBehavior) ?? 'smooth';
	const dayEl = scroller.querySelector<HTMLElement>(`[data-date="${date}"]`);
	if (!dayEl) {
		return;
	}

	const today = toUtcIsoDate(now);

	if (date !== today) {
		dayEl.scrollIntoView({ block: 'start', behavior });
		return;
	}

	const day = groupedBoard.value.find(d => d.date === date);
	const groups = day?.grouped ?? [];
	if (!groups.length) {
		dayEl.scrollIntoView({ block: 'start', behavior });
		return;
	}

	const toMin = (hhmm: string) => {
		const [hh, mm = '0'] = hhmm.split(':');
		return (+hh) * 60 + (+mm);
	};
	const nowMin = now.getHours() * 60 + now.getMinutes();

	const targetHour =
		groups
			.filter(g => !g.missed)
			.sort((a, b) => toMin(a.hour) - toMin(b.hour))
			.find(g => toMin(g.hour) >= nowMin)?.hour
		?? groups.find(g => !g.missed)?.hour
		?? groups[groups.length - 1]?.hour;

	if (targetHour) {
		const hourEl = scroller.querySelector<HTMLElement>(`[data-date="${date}"] [data-hour="${targetHour}"]`);
		if (hourEl) {
			const er = hourEl.getBoundingClientRect();
			const sr = scroller.getBoundingClientRect();
			const top = scroller.scrollTop + (er.top - sr.top) - 44; // sticky header offset
			scroller.scrollTo({ top, behavior });
			return;
		}
	}

	dayEl.scrollIntoView({ block: 'start', behavior });
}

function scrollBy(px: number) {
	const scroller = containerRef.value;
	if (!scroller) {
		return;
	}

	if (Number.isFinite(props.maxCountRowTable)) {
		return;
	}

	scroller.scrollTop += px;
}

function calcMaxCountRowVisible(height: number) {
	return calcMaxRowVisible(height).count;
}


function calcMaxRowVisible(height: number) {

	if (!boardsRef.value) {
		return { count: 0, height: 0 };
	}

	let count = 0;
	let acc = 0;

	while (true) {
		const el = boardsRef.value[count];
		if (!el) {
			break;
		}

		const elHeight = el.clientHeight;

		if (acc + elHeight > height) {
			break;
		}

		acc += elHeight;
		count += 1;
	}

	return { count, height: acc };
}

function snapHeightToNearestStep(height: number) {
	if (!boardsRef.value) {
		return 0;
	}

	const { height: heightOccupiedByContent, count: indexLastElement } = calcMaxRowVisible(height);

	const delta = height - heightOccupiedByContent;

	const el = boardsRef.value[indexLastElement];
	if (!el) {
		return heightOccupiedByContent;
	}

	const elHeight = el.clientHeight;

	if (delta > elHeight / 2) {
		return heightOccupiedByContent + elHeight;
	} else {
		return heightOccupiedByContent;
	}
}

defineExpose({ scrollToDate, scrollBy, calcMaxCountRowVisible, snapHeightToNearestStep });
</script>

<template>
	<div
		ref="container"
		:class="classes.calendarEventBoard"
		:style="Number.isFinite(props.maxCountRowTable) && { overflowY: 'clip'}"
	>
		<template
			v-for="day in groupedBoard"
			:key="day.date"
		>
			<div
				v-if="day.events.length"
				ref="boards"
				:class="classes.eventSection"
				:data-date="day.date"
			>
				<div :class="classes.boardDate">
					<ui-text token="title-200">
						{{ formatEventDate(day.date as DateYYYYMMDD) }}
					</ui-text>
				</div>

				<div
					v-for="(group, index) in day.grouped"
					:key="group.hour"
					:ref="(el) => boardsRef[index] = el as HTMLElement"
					:class="[classes.hourSection]"
					:data-hour="group.hour"
					:style="{
						visibility: index < props.maxCountRowTable ? 'visible' : 'hidden',
					}"
				>
					<div :class="[classes.hourLabel, group.missed && classes.missed]">
						<div
							:class="classes.lightning"
							:style="getHighlightColor(group.events[0].favorite, group.soon)"
						/>

						<ui-text :class="classes.hour" token="text-100-r">
							{{ group.hour }}
						</ui-text>
					</div>

					<div
						v-for="(event, i) in group.events"
						:key="`${day.date}-${group.hour}-${i}`"
						:class="classes.dayBoard"
						style="padding-top: 6px;"
					>
						<div
							v-if="event.favorite || group.soon"
							:class="classes.lightning"
							:style="getHighlightColor(event.favorite, group.soon)"
						/>

						<calendar-event-card-dashboard
							:event="event"
							:is-missed="group.missed"
							:is-favorite="event.favorite"
							@toggle-favorite="emits('toggleEventBoard', $event)"
						/>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<style module="classes">
.calendarEventBoard {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-self: stretch;
	overflow-y: scroll;
	gap: 12px;
	border-radius: 16px;
}

.boardDate {
	position: sticky;
	top: 0;
	z-index: 2;
	display: flex;
	flex: 1 0 0;
	align-items: center;
	align-self: stretch;
	height: var(--height-height-s15, 36px);
	padding-left: var(--padding-padding-s11, 20px);
	overflow: hidden;
	color: var(--text-500, rgb(255 255 255 / 96%));
	text-overflow: ellipsis;
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	background: rgb(20 20 21 / 92%);
}

.lightning {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	width: 33px;
	height: 100%;
	background:
		linear-gradient(
			270deg,
			var(--light-start) 0%,
			var(--light-mid) 100%
		);
	border-left: 2px solid var(--light-border);
	pointer-events: none;
}

@media screen and (max-width: 1024px) {
	.calendarEventBoard {
		border-radius: 0;
	}
}

.hourSection {
	position: relative;
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
}

.hourLabel {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 30px;
	padding: 8px 18px 0;
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
	gap: 10px;
}

.hour {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.dayBoard {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 0 4px;
}

.missed {
	cursor: default;
	opacity: 0.4;
}
</style>
