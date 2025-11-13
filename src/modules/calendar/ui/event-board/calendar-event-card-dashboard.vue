<script setup lang="ts">
import { computed, ref } from 'vue';

import { MarketIds, markets } from '@/modules/calendar';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiDriver } from '@/shared/ui/driver';
import { ExternalLink } from '@/shared/ui/link';

interface ICalendarEventCardProps {
	id: string;

	isMissed: boolean;
	isFavorite: boolean;

	eventType: string;
	eventTitle: string;
	eventTitleDescription?: string;
	eventDatetime?: string;
	eventSummary?: string;
	metrics: {
		label: string;
		value: string;
	}[];
	ticker?: string;
	text?: string;
	link?: string;
	linkText?: string;
	marketId?: MarketIds;
}

const props = withDefaults(defineProps<ICalendarEventCardProps>(), {
	eventDatetime: new Date().toISOString(),
	eventTitleDescription: '',
	eventSummary: '',
	ticker: 'TSLA',
	marketId: undefined,
	// eslint-disable-next-line @stylistic/max-len
	text: 'MBA 30-Year Mortgage Rate is average 30-year fixed mortgage lending rate measured during the reported week and backed by the Mortgage Bankers Association.',
	link: 'https://google.com/',
	linkText: 'Mortgage Bankers Association of America',
});

const icon = computed(() => markets.find(v => v.id === props.marketId)?.icon ?? IconIds.Globus);

const isCardOpen = ref(false);

const openEventCard = () => {
	isCardOpen.value = !isCardOpen.value;
};
</script>

<template>
	<div :class="[classes.card, props.isMissed && classes.missed]" @click="openEventCard">
		<div :class="classes.inner">
			<div :class="classes.container">
				<div :class="classes.cell">
					<div :class="classes.main">
						<ui-icon
							:id="icon"
							width="20px"
							height="20px"
						/>
						<span :class="classes.title">
							{{eventTitle}}
						</span>
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
						v-for="metric in props.metrics"
						:key="metric.label"
						:class="classes.metricData"
					>
						<div :class="classes.metricLabel">{{ metric.label }}:</div>
						<div :class="classes.metricValue">{{ metric.value }}</div>
					</div>
				</div>

				<transition name="card-expand">
					<div v-if="isCardOpen" :class="classes.details">
						<ui-driver />

						<div :class="classes.detailsContent">
							<p :class="classes.text">{{text}}</p>

							<external-link :class="classes.link" :to="link">{{linkText}}</external-link>

							<button :class="classes.chart">
								<ui-icon
									:id="IconIds.Chart"
									width="16px"
									height="16px"
								/>
								<span :class="classes.chartText">
									Launch chart
								</span>
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
	display: -webkit-box;
	overflow: hidden;
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-300-r-size, 13.3px);
	line-height: 180%;
	color: var(--text-500, rgb(255 255 255 / 96%));
	letter-spacing: 0.146px;
	text-overflow: ellipsis;
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
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
}

.dropdown:hover {
	color: var(--text-color-base-300-activated);
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
	font-size: var(--typography-paragraph-size-p00, 13px);
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.143px;
}

.metricValue {
	font-size: var(--typography-paragraph-size-p00, 13px);
	color: #ffffff;
	letter-spacing: 0.143px;
}

.details {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding-bottom: var(--padding-padding-s4, 6px);
	gap: var(--padding-padding-s12, 24px);
	overflow: hidden;
}

.detailsContent {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--padding-padding-s7, 12px);
	align-self: stretch;
}

.text {
	font-style: normal;
	font-weight: 400;
	font-size: var(--font-text-300-r-size, 13.3px);
	line-height: 180%;
	color: var(--text-300, rgb(255 255 255 / 62%));
	letter-spacing: 0.146px;
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

.chartText {
	display: -webkit-box;
	overflow: hidden;
	font-style: normal;
	font-weight: 510;
	font-size: var(--font-text-200-b-size, 12.2px);
	line-height: 180%;
	letter-spacing: 0.122px;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
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
