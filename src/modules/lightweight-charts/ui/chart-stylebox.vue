<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import { Chart, type Plugin } from 'chart.js/auto';

const container = useTemplateRef('container');
const chart = ref<Chart>();
const COLORS = {
	accent: '#FF8D29', // пунктирная рамка и середина
	center: '#FFFFFF', // белые линии
	axis: '#9A9A9D', // обычные подписи
	axisHi: '#FFFFFF', // выделенные подписи (Large, Blend)
	point: '#FFFFFF', // белая точка
	grid: 'rgba(59, 40, 87, 1)', // линии сетки
	bg: 'rgba(109, 0, 252, 0.1)', // фон сетки
};

const GRID = { rows: 12, cols: 12 };
const EXT = 12; // на сколько px линии выходят за рамку
const OFFSET = { left: 24, bottom: 24 }; // отступ текста


const styleBoxPlugin: Plugin = {
	id: 'styleBox',
	beforeDraw({ ctx, chartArea: a, scales }) {
		if (!a) {
			return;
		}

		// === ФОН ===
		ctx.save();
		ctx.fillStyle = COLORS.bg;
		ctx.fillRect(a.left, a.top, a.right - a.left, a.bottom - a.top);
		ctx.restore();

		// === СЕТКА ===
		const cw = (a.right - a.left) / GRID.cols;
		const ch = (a.bottom - a.top) / GRID.rows;
		ctx.save();
		ctx.strokeStyle = COLORS.grid;
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (let r = 1; r < GRID.rows; r++) {
			const y = Math.round(a.top + r * ch) + 0.5;
			ctx.moveTo(a.left, y); ctx.lineTo(a.right, y);
		}
		for (let c = 1; c < GRID.cols; c++) {
			const x = Math.round(a.left + c * cw) + 0.5;
			ctx.moveTo(x, a.top); ctx.lineTo(x, a.bottom);
		}
		ctx.stroke();
		ctx.restore();

		// === ОРАНЖЕВАЯ РАМКА + СЕРЕДИНА ===
		const midY = Math.round((a.top + a.bottom) / 2) + 0.5;
		ctx.save();
		ctx.setLineDash([2, 2]);
		ctx.strokeStyle = COLORS.accent;
		ctx.lineWidth = 1;

		// верхняя
		ctx.beginPath();
		ctx.moveTo(a.left - EXT, Math.round(a.top) + 0.5);
		ctx.lineTo(a.right + EXT, Math.round(a.top) + 0.5);
		ctx.stroke();

		// нижняя
		ctx.beginPath();
		ctx.moveTo(a.left - EXT, Math.round(a.bottom) - 0.5);
		ctx.lineTo(a.right + EXT, Math.round(a.bottom) - 0.5);
		ctx.stroke();

		// левая
		ctx.beginPath();
		ctx.moveTo(Math.round(a.left) + 0.5, a.top - EXT);
		ctx.lineTo(Math.round(a.left) + 0.5, a.bottom + EXT);
		ctx.stroke();

		// правая
		ctx.beginPath();
		ctx.moveTo(Math.round(a.right) - 0.5, a.top - EXT);
		ctx.lineTo(Math.round(a.right) - 0.5, a.bottom + EXT);
		ctx.stroke();

		// середина
		ctx.beginPath();
		ctx.moveTo(a.left - EXT, midY);
		ctx.lineTo(a.right + EXT, midY);
		ctx.stroke();

		ctx.restore();

		// === БЕЛЫЕ ЛИНИИ (ровные пиксели, lineWidth=1) ===
		const cx = Math.round(scales.x.getPixelForValue(0)) + 0.5;
		const topY = Math.round(a.top) + 0.5;
		const radius = 6;

		ctx.save();
		ctx.strokeStyle = COLORS.center;
		ctx.lineWidth = 1;

		// вертикаль Blend (снизу до круга)
		ctx.beginPath();
		ctx.moveTo(cx, a.bottom + EXT);
		ctx.lineTo(cx, a.top + radius);
		ctx.stroke();

		// горизонталь Large -> Blend (слева до круга)
		ctx.beginPath();
		ctx.moveTo(a.left - EXT, topY);
		ctx.lineTo(cx - radius, topY);
		ctx.stroke();

		ctx.restore();

		// === ТОЧКА ===
		ctx.save();
		ctx.fillStyle = COLORS.point;
		ctx.beginPath();
		ctx.arc(cx, a.top, radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// === ПОДПИСИ ===
		ctx.save();
		ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial';
		// слева
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'right';
		const leftX = a.left - OFFSET.left;
		ctx.fillStyle = COLORS.axisHi; ctx.fillText('Large', leftX, a.top);
		ctx.fillStyle = COLORS.axis; ctx.fillText('Mid', leftX, (a.top + a.bottom) / 2);
		ctx.fillStyle = COLORS.axis; ctx.fillText('Small', leftX, a.bottom);
		// снизу
		ctx.textBaseline = 'top';
		ctx.textAlign = 'center';
		const bottomY = a.bottom + OFFSET.bottom;
		ctx.fillStyle = COLORS.axis; ctx.fillText('Value', a.left, bottomY);
		ctx.fillStyle = COLORS.axisHi; ctx.fillText('Blend', cx, bottomY);
		ctx.fillStyle = COLORS.axis; ctx.fillText('Growth', a.right, bottomY);
		ctx.restore();
	},
};
const data = { datasets: [{ data: [], pointRadius: 0 }] };


onMounted(() => {
	chart.value = new Chart(container.value as HTMLCanvasElement, {
		type: 'scatter',
		data,
		options: {
			clip: false,
			responsive: true,
			maintainAspectRatio: false,
			aspectRatio: 1.4,
			layout: { padding: { left: 80, right: 80, top: 20, bottom: 32 } },
			plugins: { legend: { display: false }, tooltip: { enabled: false } },
			scales: {
				x: { min: -1, max: 1, grid: { display: false }, ticks: { display: false } },
				y: { min: 0, max: 100, grid: { display: false }, ticks: { display: false } },
			},
		},
		plugins: [styleBoxPlugin],
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
	height: 100% !important;
}
</style>
