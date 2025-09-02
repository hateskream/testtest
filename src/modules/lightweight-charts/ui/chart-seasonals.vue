<script setup lang="ts">
import { onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

const container = useTemplateRef('container');
const chart = shallowRef<Chart>();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const labels: string[] = [];
for (let y = 2023; y <= 2025; y++) {
	for (let m = 0; m < 12; m++) {
		labels.push(`${months[m]} ${y}`);
	}
}

function makeSeries(seed: number, base: number, vol: number) {
	let v = base, out = [];
	for (let i = 0; i < labels.length; i++) {
		const seasonal = Math.sin((i + seed) / 6) * 0.6;
		const noise = (Math.random() - 0.5) * vol;
		const dip = (i > 17 && i < 21) ? -0.6 : 0;
		v = Math.max(0, v + seasonal * 0.35 + noise * 0.25 + dip);
		out.push(parseFloat(v.toFixed(2)));
	}
	return out;
}

const s2023 = makeSeries(7, 1.4, 0.6);
const s2024 = makeSeries(11, 4.8, 0.7);
const s2025 = makeSeries(17, 5.2, 0.6);

const lastIndex = labels.length - 1;
onMounted(() => {
	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					label: '2023',
					data: s2023,
					borderColor: '#3b82f6',
					backgroundColor: '#3b82f6',
					tension: 0.35,
					pointRadius: 0,
				},
				{
					label: '2024',
					data: s2024,
					borderColor: '#d946ef',
					backgroundColor: '#d946ef',
					tension: 0.35,
					pointRadius: 0,

				},
				{
					label: '2025',
					data: s2025,
					borderColor: '#22d3ee',
					backgroundColor: '#22d3ee',
					tension: 0.35,
					pointRadius: 0,
				},
			],
		},
		options: {
			responsive: true,
			aspectRatio: 2.8,
			maintainAspectRatio: true,
			plugins: {
				legend: { display: false },
				tooltip:{
					mode:'index', intersect:false,
					backgroundColor:'#111827',
					titleColor:'#fff',
					bodyColor:'#ddd',
					callbacks:{ label:(ctx)=>`${ctx.dataset.label}: ${ctx.formattedValue}%` },
				},
				annotation: {
					annotations: {
						a2023: {
							type: 'label',
							display: true,
							xScaleID: 'x',
							yScaleID: 'y',
							xValue: 3,
							yValue: 5,
							content: [`2023 ${s2023[lastIndex].toFixed(2)}%`],
							backgroundColor: 'rgba(17,24,39,.95)',
							borderColor: '#3b82f6',
							borderWidth: 1,
							color: '#fff',
							padding: 6,
						},
						a2024: {
							type: 'label',
							display: true,
							xScaleID: 'x',
							yScaleID: 'y',
							xValue: lastIndex,
							yValue: s2024[lastIndex],
							content: [`2024 ${s2024[lastIndex].toFixed(2)}%`],
							backgroundColor: 'rgba(17,24,39,.95)',
							borderColor: '#d946ef',
							borderWidth: 1,
							color: '#fff',
							padding: 6,
						},
						a2025: {
							type: 'label',
							display: true,
							xScaleID: 'x',
							yScaleID: 'y',
							xValue: lastIndex,
							yValue: s2025[lastIndex],
							content: [`2025 ${s2025[lastIndex].toFixed(2)}%`],
							backgroundColor: 'rgba(17,24,39,.95)',
							borderColor: '#22d3ee',
							borderWidth: 1,
							color: '#fff',
							padding: 6,
						},
					},
				},
			},
			interaction: { mode: 'nearest', intersect: false },
			scales: {
				y: {
					type: 'linear',
					display: true,
					position: 'left',

					grid: {
						color: '#373737',
					},

					ticks: {
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value + 'B';
						},
					},


					border: {
						dash: [2, 2],
					},
				},
				y1: {
					type: 'linear',
					display: true,
					position: 'right',

					min: 0,
					max: 100,


					ticks: {
						maxTicksLimit: 6,
						color: 'rgba(154, 154, 157, 1)',
						callback: function (value) {
							return value + '%';
						},
					},

					grid: {
						drawOnChartArea: false,
					},
				},

				x: {
					ticks: {
						padding: 20,
						maxTicksLimit: 8,
					},

					grid: {
						display: false,
					},

					border: {
						display: false,
					},
				},
			},
		},
	});
});

const leftTrack = useTemplateRef('trackLeftRef');
const rightTrack = useTemplateRef('trackRightRef');

const positionPcts = ref({
	left: 0,
	right: 0,
});

const controllers: Record<'left'|'right', AbortController|null> = { left: null, right: null };

function onPointerDown(e: PointerEvent, side: 'left'|'right') {
	const el = (side === 'left' ? leftTrack : rightTrack).value;
	if (!el) {
		return;
	}

	controllers[side]?.abort();
	const ctrl = new AbortController();
	controllers[side] = ctrl;
	const { signal } = ctrl;

	(e.target as HTMLElement).setPointerCapture?.(e.pointerId);

	const move = (ev: PointerEvent) => {
		const r = el.getBoundingClientRect();

		if (side === 'left') {
			let x = Math.max(0, Math.min(ev.clientX - r.left, r.width));
			positionPcts.value.left = r.width ? (x / r.width) * 100 : 0;
		} else {
			let x = Math.max(0, Math.min(r.right - ev.clientX, r.width));
			positionPcts.value.right = r.width ? (x / r.width) * 100 : 0;
		}
	};

	const up = () => {
		if (side === 'left') {
			if (positionPcts.value.left >= 50) {
				// @ts-expect-error it exist
				chart.value!.data.datasets[0].hidden = true;
			} else {
				// @ts-expect-error it exist
				chart.value!.data.datasets[0].hidden = false;
			}

			positionPcts.value.left = positionPcts.value.left >= 50 ? 98 : 0;
		} else {

			if (positionPcts.value.right >= 50) {
				// @ts-expect-error it exist
				chart.value!.data.datasets[1].hidden = true;
			} else {
				// @ts-expect-error it exist
				chart.value!.data.datasets[1].hidden = false;
			}

			positionPcts.value.right = positionPcts.value.right <= 50 ? 0 : 98;
		}


		chart.value!.update();
		ctrl.abort();
	};

	window.addEventListener('pointermove', move, { signal });
	window.addEventListener('pointerup', up, { signal });

	move(e);
}
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.track">
			<div :class=classes.trackBg></div>

			<div :class="classes.trackWrapper">
				<div ref="trackLeftRef" :class="classes.leftTrack">
					<div :class="classes.sliderText">
						2023
					</div>
					<div
						:class="classes.slider"
						:style="{ left: positionPcts.left + '%' }"
						@pointerdown="onPointerDown($event, 'left')"
					>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>

				<div :class="classes.sliderCenter">
					<div :class="classes.sliderText">
						2024
					</div>
				</div>

				<div ref="trackRightRef" :class="classes.rightTrack">
					<div :class="classes.sliderText">
						2025
					</div>
					<div
						:class="classes.slider"
						:style="{ right: positionPcts.right + '%' }"
						@pointerdown="onPointerDown($event, 'right')"
					>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>

		</div>

		<canvas ref="container" :class="classes.mainChart"></canvas>


		<div :class="classes.legend">
			<div :class="classes.legendItem">
				<div :class="[classes.legendCircle, classes.legendCircleReport]"></div>
				<span>2023</span>
			</div>

			<div :class="classes.legendItem">
				<div :class="[classes.legendCircle, classes.legendCircleOther]"></div>
				<span>2024</span>
			</div>

			<div :class="classes.legendItem">
				<div :class="[classes.legendCircle, classes.legendCircleOther2]"></div>
				<span>2025</span>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.track {
	position: relative;
	width: 97%;
	height: 6px !important;
	margin: 40px auto;
	user-select: none;
}

.trackBg {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: rgb(41 41 44 / 20%);
	border-radius: 4px;
}

.sliderCenter {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 17px;
	height: 12px;
	background-color: #1b1b1d;
	border: 1px solid #212125;
	border-radius: 4px;
	transform: translateX(-50%) translateY(-50%);
}

.sliderCenter > .sliderText {
	left: 50%;
	transform: translateX(-50%);
}

.sliderText {
	position: absolute;
	top: -25px;
	font-style: normal;
	font-weight: 440;
	font-size: 12px;
	text-align: right;
	color: var(--text-color-base-100);
	letter-spacing: 0.08px;
}

.trackWrapper {
	display: flex;
	height: 100%;
}

.leftTrack,
.rightTrack {
	position: relative;
	display: flex;
	align-items: center;
	width: 101%;
	height: 100%;
	border-radius: 4px;
	pointer-events: none;
}

.rightTrack {
	justify-content: end;
}

.slider {
	position: relative;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 17px;
	height: 12px;
	background-color: #1b1b1d;
	border-radius: 4px;
	cursor: ew-resize;
	pointer-events: auto;
	gap: 2px;
}

.slider > span {
	width: 1px;
	height: 4px;
	background-color: #646568;
}

.wrapper {
	position: relative;
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	width: 100%;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 100% !important;
}

.legend {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: calc(100% - 30px);
	margin: 0 auto;
	padding: 17px 16px;
	border-top: 1px solid var(--border-color-base-300);
	gap: 31px;
}

.legendItem {
	display: flex;
	align-items: center;
	gap: 4px;
}

.legendItem span {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
}

.legendCircle {
	width: 6px;
	height: 6px;
	border-radius: 50%;
}

.legendCircleReport {
	background-color: rgb(255 255 255 / 100%);
}

.legendCircleOther {
	background-color: #fb4afb;
}


.legendCircleOther2 {
	background-color: rgb(4 237 160 / 100%);
}

.instruments {
	display: flex;
	align-items: center;
	border-top: 1px solid var(--border-color-base-300);
}
</style>
