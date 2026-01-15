<script setup lang="ts">
import { computed, ref } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ExternalLink } from '@/shared/ui/link';
import { type ICalendarEvent, markets } from '@/modules/calendar';
import { UiText } from '@/shared/ui/text';

interface ICalendarEventCardProps {
	event: ICalendarEvent;
	isMissed: boolean;
	isFavorite: boolean;
}

const props = defineProps<ICalendarEventCardProps>();

const emits = defineEmits<{
	toggleFavorite: [id: string];
}>();

const isCardOpen = ref(false);

const openEventCard = () => {
	isCardOpen.value = !isCardOpen.value;
};

const now = new Date();

const eventStartsIn = computed(() => {
	const start = new Date(props.event.meta.datetime);

	const diff = start.getTime() - now.getTime();
	const mins = Math.round(diff / 60000);

	if (mins > 0 && mins < 60) {
		return `in ${mins} min${mins === 1 ? '' : 's'}`;
	}

	return null;
});

const { goToTickerPage } = useGoToTickerPage();

</script>

<template>
	<div :class="[classes.card, props.isMissed && classes.missed]" @click="openEventCard">
		<div :class="classes.cardHeader">
			<div :class="classes.flexStart">
				<div :class="classes.eventType">
					{{ props.event.meta.category }}
				</div>

				<div v-if="eventStartsIn" :class="classes.eventStartsIn">
					{{ eventStartsIn }}
				</div>

				<button
					:class="[classes.buttonIcon, props.isFavorite && classes.favorite]"
					@click="emits('toggleFavorite', props.event.id)"
				>
					<ui-icon
						:id="IconIds.Favorite"
						width="16px"
						height="16px"
					/>
				</button>
			</div>
			<div :class="classes.flexEnd">
				<div v-if="props.event.meta.badge" :class="classes.eventSummary">
					{{ props.event.meta.badge?.label }}
				</div>
			</div>
		</div>
		<div :class="classes.cardHeadline">
			<div :class="classes.eventTitle">
				<div v-if="props.event.meta.country" :class="classes.iconWrapper">
					<ui-icon
						:id="markets.find(v => v.id === props.event.meta.country)?.icon ?? IconIds.Globus"
						width="20px"
						height="20px"
					/>
				</div>

				<div :class="classes.eventTitle">{{ props.event.meta.title }}</div>

				<div
					v-if="props.event.meta.description"
					class="text-300-r"
					:class="classes.eventTitleDescription"
				>
					{{ props.event.meta.description }}
				</div>

				<ui-icon
					:id="IconIds.DropdownDown"
					width="18px"
					height="18px"
				/>
			</div>
			<div :class="classes.eventMetrics">
				<div
					v-for="metric in props.event.metrics"
					:key="metric.label"
					:class="classes.metricData"
				>
					<ui-text
						token="text-300-r"
						as="div"
						:class="classes.metricLabel"
					>
						{{ metric.label }}:
					</ui-text>
					<ui-text
						token="text-300-r"
						as="div"
						:class="classes.metricValue"
					>
						{{ metric.value }}
					</ui-text>
				</div>
			</div>
		</div>

		<!-- FIXME: transition doesnt work -->
		<transition name="slide-fade">
			<div
				v-show="isCardOpen"
				:class="classes.cardBody"
				class="text-300-r"
			>
				<div :class="classes.eventText">
					{{ props.event.meta.description }}
				</div>

				<external-link
					v-if="props.event.details"
					:to="props.event.details.link"
					@click.stop
				>
					{{ props.event.details.label }}
				</external-link>

				<div :class="classes.launcChartAction" @click.stop="goToTickerPage(props.event.canonical_ticker_id)">
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
.card {
	z-index: 1;
	display: flex;
	flex-direction: column;
	padding: 12px 10px;
	background: var(--color-bg-surface-02, #161618);
	border-radius: 16px;
	gap: 12px;
	container-type: inline-size;
	container-name: event-card;
	cursor: pointer;
	transition: opacity 0.25s ease, background-color 0.25s ease;
}

.card:hover {
	background: #1b1b1d;
}

.card.missed {
	opacity: 0.4;
}

.card.missed:hover {
	opacity: 0.95;
}

.buttonIcon {
	width: 16px;
	height: 16px;
	padding: 0;
	line-height: 0;
	color: rgb(100 101 104 / 100%);
}

.favorite {
	color: rgb(230 171 10);
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
			color: var(--color-text-base-300, #9a9a9d);
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
			color: var(--color-text-base-300, #9a9a9d);
		}

		.metricValue {
			color: #ffffff;
		}
	}
}

.cardBody {
	display: flex;
	flex-direction: column;
	color: var(--color-text-base-300, #9a9a9d);
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
