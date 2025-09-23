<script setup lang="ts">
import { computed, ref } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ExternalLink } from '@/shared/ui/link';
import { MarketIds, markets } from '@/modules/calendar';

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

const emits = defineEmits<{
	toggleFavorite: [id: string];
}>();

const isCardOpen = ref(false);

const openEventCard = () => {
	isCardOpen.value = !isCardOpen.value;
};

const now = new Date();

const eventStartsIn = computed(() => {
	const start = new Date(props.eventDatetime);

	const diff = start.getTime() - now.getTime();
	const mins = Math.round(diff / 60000);

	if (mins > 0 && mins < 60) {
		return `in ${mins} min${mins === 1 ? '' : 's'}`;
	}

	return null;
});
</script>

<template>
	<div
		:class="[
			classes.calendarEventCard,
			props.isMissed && classes.missed
		]"
	>
		<div :class="classes.cardHeader">
			<div :class="classes.flexStart">
				<div :class="classes.eventType">
					{{ props.eventType }}
				</div>

				<div v-if="eventStartsIn" :class="classes.eventStartsIn">
					{{ eventStartsIn }}
				</div>

				<button
					:class="[classes.buttonIcon, props.isFavorite && classes.favorite]"
					@click="emits('toggleFavorite', props.id)"
				>
					<ui-icon
						:id="IconIds.Favorite"
						width="16px"
						height="16px"
					/>
				</button>
			</div>
			<div :class="classes.flexEnd">
				<div :class="classes.eventSummary">
					{{ props.eventSummary }}
				</div>
			</div>
		</div>
		<div :class="classes.cardHeadline">
			<div :class="classes.eventTitle" @click="openEventCard">
				<div v-if="props.marketId" :class="classes.iconWrapper">
					<ui-icon
						:id="markets.find(v => v.id === props.marketId)!.icon"
						width="20px"
						height="20px"
					/>
				</div>

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
	padding: 12px 10px;
	background: var(--color-bg-surface-02, #161618);
	border-radius: 16px;
	gap: 12px;
	container-type: inline-size;
	container-name: event-card;
}

.buttonIcon {
	width: 16px;
	height: 16px;
	padding: 0;
	line-height: 0;
	color: rgb(100 101 104 / 100%);
	cursor: pointer;
}

.favorite {
	color: rgb(230 171 10);
}


.missed {
	cursor: default;
	opacity: 0.4;
	pointer-events: none;
}

.iconWrapper {
	display: grid;
	width: 32px;
	height: 32px;
	line-height: 0;
	border: 1px solid var(--color-border-base-300, rgb(97 97 97 / 30%));
	border-radius: 50%;
	place-items: center;
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
	flex-direction: row;
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

@container event-card (max-width: 700px) {
	.cardHeadline {
		gap: 12px;
		flex-direction: column;
	}
}

.eventMetrics {
	display: flex;
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	align-self: stretch;
	gap: 2px 16px;

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
	gap: 12px;


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
