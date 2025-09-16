<script setup lang="ts">
import { computed, ref } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ExternalLink } from '@/shared/ui/link';
import { tickerIcon } from '@/shared/ui/ticker';


interface ICalendarEventCardProps {
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
}

const props = withDefaults(defineProps<ICalendarEventCardProps>(), {
	eventDatetime: new Date().toISOString(),
	eventTitleDescription: '',
	eventSummary: '',
	ticker: 'TSLA',
	// eslint-disable-next-line @stylistic/max-len
	text: 'MBA 30-Year Mortgage Rate is average 30-year fixed mortgage lending rate measured during the reported week and backed by the Mortgage Bankers Association.',
	link: 'https://google.com/',
	linkText: 'Mortgage Bankers Association of America',
});

const isCardOpen = ref(false);

const openEventCard = () => {
	isCardOpen.value = !isCardOpen.value;
};


const eventStartsIn = computed(() => {
	const now = new Date();
	const eventDate = new Date(props.eventDatetime);
	const diffTime = Math.abs(eventDate.getTime() - now.getTime());
	// const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	// const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
	const diffMinutes = Math.ceil(diffTime / (1000 * 60));

	return `in ${diffMinutes} mins`;
});
</script>

<template>
	<div :class="classes.calendarEventCard">
		<div :class="classes.cardHeader">
			<div :class="classes.flexStart">
				<div :class="classes.eventType">
					{{ props.eventType }}
				</div>

				<div :class="classes.eventStartsIn">
					{{ eventStartsIn }}
				</div>
			</div>
			<div :class="classes.flexEnd">
				<div :class="classes.eventSummary">
					{{ props.eventSummary }}
				</div>
			</div>
		</div>
		<div :class="classes.cardHeadline">
			<div :class="classes.eventTitle" @click="openEventCard">
				<!-- FIXME: Get ticker icon from the server -->
				<ticker-icon src="@/assets/images/stock/TSLA.png" :ticker="props.ticker" />

				<div :class="classes.eventTitle">{{ props.eventTitle }}</div>

				<div
					v-if="props.eventTitleDescription"
					:class="classes.eventTitleDescription"
				>
					{{ props.eventTitleDescription }}
				</div>

				<ui-icon
					:id="IconIds.DropdownDown"
					width="18px"
					height="18px"
				/>
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
		</div>

		<!-- FIXME: transition doesnt work -->
		<transition name="slide-fade">
			<div v-show="isCardOpen" :class="classes.cardBody">
				<div :class="classes.eventText">
					{{ props.text }}
				</div>

				<external-link :to="props.link">{{ props.linkText }}</external-link>

				<div :class="classes.launcChartAction">
					<ui-icon
						:id="IconIds.GraphIcon"
						width="20"
						height="20"
					/>

					Launch chart
				</div>
			</div>
		</transition>
	</div>
</template>

<style module="classes">
.calendarEventCard {
	display: flex;
	flex-direction: column;
	padding: 12px 16px;
	background: var(--color-bg-surface-02, #161618);
	border-radius: 20px;
	gap: 8px;
}

.cardHeader {
	display: inline-flex;
	justify-content: space-between;
	align-self: stretch;
	gap: 8px;

	.flexStart {
		display: inline-flex;
		align-items: center;
		gap: 8px;

		.eventType {
			font-weight: 440;
			font-size: 10px;
			color: var(--color-text-base-300, #9a9a9d);
			text-transform: uppercase;
			letter-spacing: 0.08px;
			text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
		}

		.eventStartsIn {
			font-weight: 440;
			font-size: 10px;
			color: #ff2424;
			text-transform: lowercase;
			letter-spacing: 0.08px;
			text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
		}
	}
}

.cardHeadline {
	display: inline-flex;
	justify-content: space-between;

	.eventTitle {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;

		.eventTitleDescription {
			font-size: var(--typography-paragraph-size-p00, 13px);
			color: var(--color-text-base-300, #9a9a9d);
			letter-spacing: 0.143px;
			text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
		}
	}
}


.eventMetrics {
	display: inline-flex;
	align-items: center;
	gap: 16px;

	.metricData {
		display: inline-flex;
		align-items: center;
		gap: 4px;

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
	}
}

.cardBody {
	display: flex;
	flex-direction: column;
	font-size: var(--typography-paragraph-size-p00, 13px);
	color: var(--color-text-base-300, #9a9a9d);
	letter-spacing: 0.143px;
	gap: 24px;


	.launcChartAction {
		display: flex;
		align-items: center;
		width: fit-content;
		min-height: var(--control-lg-min-heigh, 32px);
		padding: 0 var(--control-lg-padding-text-l-r, 12px) 0 var(--control-lg-padding-icon-l-r, 8px);
		border: 1px solid var(--color-border-base-300, rgb(97 97 97 / 30%));
		border-radius: var(--radius-full, 9999px);
		gap: var(--control-xl-gap, 6px);
		cursor: pointer;
	}
}
</style>
