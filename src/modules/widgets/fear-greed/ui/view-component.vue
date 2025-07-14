<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import { Tension, type ISize, type ITension, type ITensionTextData } from '../model';
import { useMapTension } from '../composables';
import { useFearGreedStore } from '../stores';
import { UiTransitionFade } from '@/shared/ui/transition';

export interface IViewComponentProps {
	tension: ITension;
	size: ISize;
}

export interface IViewComponentEmits {
	(e: 'updateInteractive'): void;
}

const props = defineProps<IViewComponentProps>();

const emits = defineEmits<IViewComponentEmits>();

const { mapTension } = useMapTension();

const fearGreedStore = useFearGreedStore();

const tensionText = computed<ITensionTextData>(() => mapTension(props.tension.tension ?? 0));
const history = computed(() =>
	(props.tension?.history ?? []).map(item => ({
		style: { color: mapTension(item.value).colors.text },
		name: item.displayName,
		tension: item.value,
	})),
);

const circleChart = computed(() => {
	const tension = props.tension.tension ?? 0;

	let val = 1;

	if (tension <= Tension.extremeFear.max) {
		val = 1;
	} else if (tension <= Tension.fear.max) {
		val = 25;
	} else if (tension <= Tension.neutral.max) {
		val = 50;
	} else if (tension <= Tension.greed.max) {
		val = 75;
	} else if (tension <= Tension.extremeGreed.max) {
		val = 99;
	}


	const arrowRotateInDeg = -90 + (tension / 100) * 180;

	const radius = 80;

	const totalLength = Math.PI * radius;
	const arcAngle = 180 / 4.5;
	const arcLength = (arcAngle / 180) * totalLength;

	const signOffset = tension === 100 ? -1 : -(val / 100);

	const offset = signOffset * (totalLength - arcLength);

	return {
		arrowRotateInDeg,

		activeLine: {
			radius,
			dasharray: `${arcLength}, ${totalLength}`,
			offset,
		},
	};
});

const metricTextStyles = computed<CSSProperties>(() => ({
	marginTop: fearGreedStore.isShowChart && props.size.h > 2 ? '-30px' : 0,
}));
</script>

<template>
	<div :class="classes.container">
		<div
			:class="classes.metric"
			@click.stop.prevent="emits('updateInteractive')"
		>
			<div
				v-if="fearGreedStore.isShowChart && size.h > 2"
				:class="classes.metricСhart"
			>

				<svg
					width="200"
					height="100"
					viewBox="0 0 200 100"
					:class="classes.metricСhartContainer"
				>
					<!-- Фоновая дуга -->
					<path
						:class="classes.metricСhartBg"
						d="M 20,100 A 80,80 0 0,1 180,100"
					/>

					<!-- Активная дуга -->
					<path
						d="M 20,100 A 80,80 0 0,1 180,100"
						:class="classes.metricСhartActive"
						:stroke="tensionText.colors.chart"
						:stroke-dasharray="circleChart.activeLine.dasharray"
						:stroke-dashoffset="circleChart.activeLine.offset"
					/>
				</svg>

				<div :class="classes.metricСhartArrowContainer">
					<div
						:class="classes.metricСhartArrow"
						:style="{
							transform: `rotate(${circleChart.arrowRotateInDeg}deg)`,
						}"
					>
						<div :class="classes.metricСhartDot" />
					</div>
				</div>
			</div>

			<div
				:class="classes.metricDescription"
				:style="metricTextStyles"
			>
				<h3 :style="{ color: tensionText?.colors.text }">
					{{ tension.tension }}
				</h3>
				<ui-transition-fade>
					<h4 v-if="fearGreedStore.isShowName">{{ tensionText?.text.main }}</h4>
				</ui-transition-fade>
				<ui-transition-fade>
					<small v-if="fearGreedStore.isShowDescription && props.size.h > 2">
						{{ tensionText?.text.sub }}
					</small>
				</ui-transition-fade>
			</div>
		</div>

		<ui-transition-fade>
			<ul
				v-if="
					(history.length > 0 && fearGreedStore.isShowPastValues) &&
						(size.h > 4 || (size.w >= 2 && size.h > 2))"
				:class="classes.history"
			>
				<li
					v-for="item in history"
					:key="item.name"
				>
					<p>{{ item.name }}</p>
					<p :style="item.style">
						{{ item.tension }}
					</p>
				</li>
			</ul>
		</ui-transition-fade>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-top: 12px;
	gap: 25px 32px;
}

.metric {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 180px;
}

.metricDescription > h3 {
	font-weight: 460;
	font-size: 28px;
	color: var(--common-color-white-700);
}

.metricDescription {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	height: 70px;
}

.metricСhart {
	position: relative;
	width: 200px;
	height: 100px;
}

.metricСhartContainer {
	position: absolute;
	top: 0;
	left: 0;
}

.metricСhartBg {
	fill: none;
	stroke: rgb(91 91 91 / 50%);
	stroke-width: 2;
}

.metricСhartActive {
	fill: none;
	stroke-width: 4;
	stroke-linecap: round;
	transition: stroke-dashoffset 0.7s ease-in-out;
}

.metricСhartArrowContainer {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	width: 100%;
	height: 100%;
}

.metricСhartArrow {
	position: absolute;
	width: 2px;
	height: 77px;
	/* stylelint-disable-next-line declaration-colon-newline-after */
	background: linear-gradient(
		225deg,
		rgb(255 255 255 / 20%) 0%,
		rgb(255 255 255 / 20%) 22.5%,
		rgb(255 255 255 / 0%) 48.5%
	);
	transform-origin: bottom right;
	transition: transform 0.7s ease-in-out;
}

.metricСhartDot {
	position: absolute;
	top: -7px;
	left: 50%;
	width: 8px;
	height: 8px;
	background: #ffffff;
	border-radius: 50%;
	box-shadow: 0 0 15px rgb(227 168 119 / 80%);
	transform: translateX(-50%);
}

.metricСhartDot::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 28px;
	height: 28px;
	background-color: rgb(255 255 255 / 10%);
	border-radius: 100%;
	transform: translate(-50%, -50%);
	filter: blur(1px);
}

.history {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 165px;
	gap: 5px;
}

.history li {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 4px;
}

.history li > p:first-child {
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-300);
}

.history li > p:last-child {
	font-weight: 440;
	font-size: 12px;
	color: #ffffff;
}

.metricDescription > h4 {
	font-size: 13px;
	color: var(--common-color-white-700);
}

.metricDescription > small {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
}
</style>
