<script setup lang="ts">
import { computed, ref } from 'vue';

import { type ICalendarEvent, calendarCountryData } from '../../model/calendar';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiDriver } from '@/shared/ui/driver';
import { ExternalLink } from '@/shared/ui/link';
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';
import { isFeatureEnabled } from '@/shared/lib';
import { UiImage } from '@/shared/ui/image';
import { useGoToTickerPage } from '@/modules/chart';

interface ICalendarEventCardProps {
	event: ICalendarEvent;
	isMissed: boolean;
	isFavorite: boolean;
}

const props = defineProps<ICalendarEventCardProps>();

const icon = computed(
	() => calendarCountryData.find(v => v.id === props.event.meta.country)?.icon ?? IconIds.Globus,
);

const isCardOpen = ref(false);

const openEventCard = () => {
	isCardOpen.value = !isCardOpen.value;
};

const isChartEnabled = isFeatureEnabled('CALENDAR_OPEN_CHART');

const { goToTickerPage } = useGoToTickerPage();
</script>

<template>
	<div :class="[classes.card, props.isMissed && classes.missed]" @click="openEventCard">
		<div :class="classes.inner">
			<div :class="classes.container">
				<div :class="classes.head">
					<ui-text
						token="text-100-r-up"
						:class="classes.category"
					>
						{{props.event.meta.category}}
					</ui-text>

					<div
						v-if="props.event.meta.badge"
						:class="[classes.badge, classes[`badge-${props.event.meta.badge.color}`]]"
					>
						<ui-text token="text-200-r">
							{{props.event.meta.badge.label}}
						</ui-text>
					</div>
				</div>

				<div :class="classes.cell">
					<div :class="classes.main">
						<ui-image
							v-if="props.event.meta.image"
							:src="props.event.meta.image"
							:class="classes.icon"
							width="20px"
							height="20px"
						/>
						<ui-icon
							v-else
							:id="icon"
							:class="classes.icon"
							width="20px"
							height="20px"
						/>
						<ui-clamped :class="classes.title" :rows="1">
							<ui-text token="text-300-r">{{ props.event.meta.title }}</ui-text>
						</ui-clamped>
					</div>
					<button :class="classes.dropdown">
						<ui-icon
							:id="IconIds.DropdownDown"
							width="16px"
							height="16px"
						/>
					</button>
				</div>

				<div :class="classes.eventMetrics">
					<div
						v-for="metric in props.event.metrics"
						:key="metric.label"
						:class="classes.metricData"
					>
						<ui-text
							:class="classes.metricLabel"
							token="text-300-r"
							as="div"
						>
							{{ metric.label }}:
						</ui-text>
						<ui-text
							:class="classes.metricValue"
							token="text-300-r"
							as="div"
						>
							{{ metric.value }}
						</ui-text>
					</div>

					<div :class="classes.metricData">
						<ui-text
							:class="classes.metricLabel"
							token="text-300-r"
							as="div"
						>
							Impact:
						</ui-text>
						<ui-text
							:class="classes.metricValue"
							token="text-300-r"
							as="div"
						>
							{{ props.event.meta.impact }}
						</ui-text>
					</div>
				</div>

				<transition name="card-expand">
					<div v-if="isCardOpen" :class="classes.details">
						<ui-driver />

						<div :class="classes.detailsContent">
							<ui-text
								:class="classes.text"
								token="text-300-r"
								as="p"
							>
								{{ props.event.meta.description || 'No description yet.' }}
							</ui-text>

							<external-link
								v-if="props.event.details?.link && props.event.details.label"
								:class="classes.link"
								:to="props.event.details.link"
							>
								{{ props.event.details.label }}
							</external-link>

							<button
								v-if="isChartEnabled"
								:class="classes.chart"
								@click.stop="goToTickerPage(props.event.canonical_ticker_id)"
							>
								<ui-icon
									:id="IconIds.Chart"
									width="16px"
									height="16px"
								/>
								<ui-clamped :rows="1">
									<ui-text token="text-200-b">Launch chart</ui-text>
								</ui-clamped>
							</button>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.card {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding: 1px 0;
	border-radius: var(--radius-04-in, 20px);
	cursor: pointer;
	gap: 10px;
	transition: opacity 0.25s ease, background-color 0.25s ease;
}

.card:hover {
	background-color: var(--atom-base-90, rgb(73 73 80 / 15%));
}

.missed {
	opacity: 0.4;
}

.missed:hover {
	opacity: 0.95;
}

.inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: stretch;
	padding: var(--padding-padding-s7, 12px) var(--padding-padding-s8, 14px);
	gap: var(--padding-padding-s5, 8px);
	border-radius: 20px;
}

.container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--padding-padding-s5, 8px);
	align-self: stretch;
}

.head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.category {
	color: var(--text-300, rgb(255 255 255 / 62%));
	text-overflow: ellipsis;
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
}

.cell {
	display: flex;
	align-items: center;
	align-self: stretch;
	height: var(--height-height-s14, 32px);
	padding: 8px 0;
}

.main {
	display: flex;
	align-items: center;
	gap: var(--padding-padding-s4, 6px);
}

.title {
	color: var(--text-500, rgb(255 255 255 / 96%));
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
}

.dropdown {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: var(--height-height-s12, 24px);
	gap: var(--padding-padding-s0, 0);
	aspect-ratio: 1/1;
	color: var(--contrast-contrast-60, rgb(255 255 255 / 40%));
	cursor: pointer;
	transition: 0.25s color ease;
}

.dropdown:hover,
.card:hover .dropdown {
	color: var(--text-color-base-300-activated);
}

.bottomWrapper {
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
}

.eventMetrics {
	display: flex;
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	align-self: stretch;
	gap: 2px 16px;
}

.metricData {
	display: inline-flex;
	align-items: center;
	gap: 4px;
}

.metricLabel {
	color: var(--color-text-base-300, #9a9a9d);
}

.metricValue {
	color: #ffffff;
}

.details {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding-bottom: var(--padding-padding-s4, 6px);
	gap: 6px;
	overflow: hidden;
}

.icon {
	border-radius: 50%;
}

.detailsContent {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--padding-padding-s7, 12px);
	align-self: stretch;
}

.text {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.chart {
	display: flex;
	align-items: center;
	height: 24px;
	padding: 0 var(--tile-padding-md-in, 10px) 0 var(--tile-padding-md-out, 6px);
	color: var(--text-300, rgb(255 255 255 / 62%));
	cursor: pointer;
	gap: var(--tile-padding-md-gap, 3px);
}

.chart:hover {
	color: var(--text-color-base-300-activated);
}

.badge {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	height: 24px;
	padding: 3px 6px;
	border-radius: 6px;
}

.badge-neutral {
	color: var(--text-500, rgb(255 255 255 / 96%));
	background-color: var(--base-base-80, rgb(73 73 80 / 22%));
}

.badge-positive {
	color: var(--success-success-00, #04eda0);
	background-color: var(--success-success-90, rgb(4 237 160 / 10%));
}

.badge-negative {
	color: var(--warning-warning-00, #fc1d4d);
	background-color: var(--warning-success-90, rgb(252 29 77 / 10%));
}
</style>

<style scoped>
.card-expand-enter-from,
.card-expand-leave-to {
	max-height: 0;
	transform: translateY(-4px);
	opacity: 0;
}

.card-expand-enter-active,
.card-expand-leave-active {
	overflow: hidden;
	transition: max-height 250ms ease, opacity 250ms ease, transform 250ms ease;
}

.card-expand-enter-to,
.card-expand-leave-from {
	max-height: 2000px;
	transform: translateY(0);
	opacity: 1;
}
</style>
