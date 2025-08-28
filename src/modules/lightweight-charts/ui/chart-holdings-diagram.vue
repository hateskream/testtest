<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart } from 'chart.js/auto';

import MaskImage from '@/assets/images/mock/mask-bg-diagram-ticker-page.png';


const container = useTemplateRef('container');
const chart = ref<Chart>();

onMounted(() => {
	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'doughnut',
		data: {
			datasets: [
				{
					data: [40, 50, 69, 70, 75, 69, 70, 75],
					backgroundColor: [
						'#67D177',
						'#FFD400',
						'#FF008C',
						'#DF8B3B',
						'#E8517E',
						'#FFA9F6',
						'#9A18F7',
						'#0073FF',
					],
					borderWidth: 0,
					hoverOffset: 12,
				},
			],
		},
		plugins: [
			{
				id: 'centerText',
				afterDraw(ch, _, opts) {

					if (!opts?.image) {
						return;
					}

					if (opts.image instanceof HTMLImageElement) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						chart.value.$centerImage = opts.image;
						return;
					}

					const { ctx } = ch;
					ctx.save();

					const meta = ch.getDatasetMeta(0);
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					const [{ x, y, innerRadius }] = meta.data;

					if (opts.image) {
						const img = new Image();
						img.src = opts.image;

						const scale = opts.imageScale || 0.7;
						const size = innerRadius * 2 * scale;

						if (img.complete) {
							ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
						} else {
							img.onload = () => {
								ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
							};
						}
					}

					if (opts.text) {
						ctx.font = opts.font || 'bold 20px Arial';
						ctx.fillStyle = opts.color || '#000';
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						ctx.fillText(opts.text, x, y);
					}

					ctx.restore();
				},
			},
		],
		options: {
			maintainAspectRatio: false,
			responsive: true,

			interaction: {
				mode: 'index',
				intersect: false,
			},
			plugins: {
				legend: {
					display: false,
				},

				tooltip: {
					enabled: true,
					position: 'nearest',
					padding: 12,
					backgroundColor: 'rgba(22, 22, 24, 0.60)',
					bodyFont: {
						size: 16,
					},
					caretSize: 0,
					displayColors: false,
					callbacks: {
						label: function (context) {
							let label = context.dataset.label || '';

							if (context.parsed !== null) {
								label = `${context.parsed}%`;
							}
							return label;
						},
					},
				},

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				centerText: {
					image: MaskImage,
					imageSize: 40,
					imageOffsetY: -20,
					text: 'DIA',
					font: 'bold 28px Arial',
					color: '#fff',
				},
			},

			scales: {
				y: {
					display: false,
				},

				x: {
					display: false,
				},

			},
		},
	});
});


</script>

<template>
	<div :class="classes.wrapper">
		<canvas ref="container" :class="classes.mainChart"></canvas>
	</div>
</template>


<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 90% !important;
}
</style>
