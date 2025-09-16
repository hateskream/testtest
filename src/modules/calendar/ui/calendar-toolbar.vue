<script setup lang="ts">
import { computed } from 'vue';

import {
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
	ModalSubmenuContent,
	ModalItemCheckbox,
} from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { CalendarComponent } from '@/modules/calendar/ui';
import type { IMarketData, IToolbarUserState } from '@/modules/calendar/types';
import { tickerIcon } from '@/shared/ui/ticker';
import { EventType, Impact } from '@/modules/calendar';

interface ICalendarProps {
	markets: IMarketData[];
	eventTypes: EventType[];
	impacts: Impact[];

	weekDays: { date: Date }[];
	locale?: string;
}

const props = defineProps<ICalendarProps>();

const emits = defineEmits<{
	'prev-week': [];
	'next-week': [];
}>();

const state = defineModel<IToolbarUserState>('state', { required: true });
const selectedDate = defineModel<Date>('selectedDate', { required: true });

const src = new URL('@/assets/icons/globus.svg', import.meta.url).href;

const startDate = computed(() => props.weekDays[0].date);
const endDate = computed(() => props.weekDays[props.weekDays.length - 1].date);

const label = computed(() => {
	const sameYear = startDate.value.getFullYear() === endDate.value.getFullYear();
	const fmtNoYear = new Intl.DateTimeFormat(props.locale, { month: 'short', day: 'numeric' });
	const fmtWithYear = new Intl.DateTimeFormat(props.locale, { month: 'short', day: 'numeric', year: 'numeric' });

	const left = sameYear ? fmtNoYear.format(startDate.value) : fmtWithYear.format(startDate.value);
	const right = fmtWithYear.format(endDate.value);

	return `${left} — ${right}`;
});
</script>

<template>
	<div :class="classes.calendarToolbar">
		<div :class="classes.toolbarStart">
			<modal-badge
				class="market-modal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<ticker-icon
						:id="IconIds.Home"
						:src="src"
						:size="12"
						:padding="0"
						:ticker="state.market.label"
					/>
					<span>
						{{state.market.label}}
					</span>
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>Markets</template>
						<template #default>
							<modal-item-selector
								v-for="market in props.markets"
								:key="market.label"
								:model-value="state.market.label === market.label"
								@update:model-value="state.market = market"
							>
								<div :class="classes.modalItem">
									<ticker-icon
										:id="IconIds.Home"
										:src="src"
										:size="18"
										:padding="3"
										:ticker="market.label"
										:class="classes.tickerIcon"
									/>
									<span>
										{{market.label}}
									</span>
								</div>
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge
				class="watchlist-modal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<span>Watchlist</span>
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>
			</modal-badge>

			<modal-badge
				class="event-type-model"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<span>Event Type</span>
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>
							Event type
						</template>
						<template #default>
							<modal-item-checkbox
								v-for="(event, index) in props.eventTypes"
								:key="index"
								:model-value="event === state.eventType"
								@update:model-value="state.eventType = event"
							>
								{{event}}
							</modal-item-checkbox>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge
				class="impact-model"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<span>Impact</span>
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>
							Impact
						</template>
						<template #default>
							<modal-item-checkbox
								v-for="(impact, index) in props.impacts"
								:key="index"
								:model-value="impact === state.impact"
								@update:model-value="state.impact = impact"
							>
								{{impact}}
							</modal-item-checkbox>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge
				class="date-modal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<ui-icon
						:id="IconIds.Calendar"
						width="12px"
						height="12px"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>
				<template #content>
					<modal-submenu-content>
						<template #content>
							<calendar-component v-model="selectedDate" @update-week="selectedDate = $event" />
						</template>

					</modal-submenu-content>
				</template>
			</modal-badge>
		</div>

		<div :class="classes.toolbarEnd">
			<button :class="classes.nav" @click="emits('prev-week')">
				<ui-icon
					:id="IconIds.DropdownDown"
					width="12"
					height="12"
					:class="['dropdown-icon']"
				/>
			</button>
			<button :class="classes.nav" @click="emits('next-week')">
				<ui-icon
					:id="IconIds.DropdownDown"
					width="12"
					height="12"
					:class="['dropdown-icon']"
				/>
			</button>
			<div :class="classes.label">{{ label }}</div>
		</div>
	</div>
</template>

<style module="classes">
.calendarToolbar {
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
}

.toolbarStart {
	display: flex;
	align-items: center;
	gap: 8px;
}

.modalItem {
	display: flex;
	align-items: center;
	gap: 6px;
}

.tickerIcon {
	padding: 1px;
}

.toolbarEnd {
	display: flex;
	align-items: center;
	width: 275px;
	color: #eeeeee;
	gap: 0.75rem;
}

.label {
	margin-left: auto;
	font-weight: 600;
	font-size: 0.875rem;
}

.nav {
	display: grid;
	width: 2rem;
	height: 2rem;
	color: inherit;
	background: transparent;
	border: none;
	border-radius: 0.5rem;
	cursor: pointer;
	place-items: center;

	&:first-child {
		transform: rotate(90deg);
	}

	&:nth-child(2) {
		transform: rotate(-90deg);
	}
}

.nav:hover {
	background: #1a1a1a;
}
</style>
