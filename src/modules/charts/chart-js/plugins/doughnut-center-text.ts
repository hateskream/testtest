import type { ArcElement, Chart, ChartMeta, Plugin } from 'chart.js';

type PluginChartType = 'doughnut';

export type DoughnutCenterTextPluginOptions = {
	image?: string;

	/**
	 * @default 1
	 */
	imageScale: number;

	/**
	 * Режим масштабирования изображения внутри центрального круга
	 * @default natural
	 */
	imageFit: 'natural' | 'cover' | 'contain';

	/**
	 * Длительность анимации появления изображения
	 * @default 500
	 */
	imageFadeDuration: number;

	text?: string;
	/**
	 * Размер текста
	 * @default 26
	 */
	fontSize: number;

	/**
	 * Цвет текста
	 * @default #000
	 */
	color: string;

	/**
	 * Отступ от внутренней окружности
	 * @default 4
	 */
	padding: number;
};

type ChartWithImageCache = Chart<PluginChartType> & {
	_doughnutCenterImage?: HTMLImageElement;
	_doughnutCenterImageSrc?: string;
	_doughnutCenterImageOpacity?: number;
	_doughnutCenterImageFrame?: number;
};

function getChartMetas(chart: Chart<PluginChartType>) {
	return chart.data.datasets.reduce(
		(acc, _, key) => {
			if (!chart.isDatasetVisible(key)) {
				return acc;
			}

			const meta = chart.getDatasetMeta(key) as ChartMeta<PluginChartType, ArcElement>;
			if (meta.data.length) {
				acc.push(meta);
			}

			return acc;
		},
		[] as ChartMeta<PluginChartType, ArcElement>[],
	);
}

export const doughnutCenterTextPlugin: Plugin<PluginChartType, DoughnutCenterTextPluginOptions> = {
	id: 'doughnutCenterText',
	defaults: {
		imageScale: 1,
		imageFit: 'natural',
		imageFadeDuration: 500,
		fontSize: 26,
		color: '#000',
		padding: 4,
	},
	beforeDraw(chart, _args, options) {
		if (!options.image && !options.text) {
			return;
		}

		const metas = getChartMetas(chart);
		if (!metas.length) {
			return;
		}

		const [{ x, y }] = metas[0].data;

		let innerRadius = Infinity;

		for (const meta of metas) {
			for (const el of meta.data) {
				innerRadius = Math.min(innerRadius, el.innerRadius);
			}
		}

		if (!isFinite(innerRadius) || innerRadius <= 0) {
			return;
		}

		const { padding } = options;

		const safeRadius = Math.max(innerRadius - padding, 0);

		const instance = chart as ChartWithImageCache;
		const { ctx } = chart;
		ctx.save();

		ctx.beginPath();
		ctx.arc(x, y, safeRadius, 0, Math.PI * 2);
		ctx.clip();

		if (options.image) {
			if (instance._doughnutCenterImageFrame) {
				cancelAnimationFrame(instance._doughnutCenterImageFrame);
			}

			let img = instance._doughnutCenterImage;

			if (!img || instance._doughnutCenterImageSrc !== options.image) {
				img = new Image();
				img.src = options.image;

				instance._doughnutCenterImage = img;
				instance._doughnutCenterImageSrc = options.image;
				instance._doughnutCenterImageOpacity = 0;

				img.onload = () => {
					const duration = options.imageFadeDuration;
					const start = performance.now();

					const animate = (now: number) => {
						const progress = Math.min((now - start) / duration, 1);
						instance._doughnutCenterImageOpacity = 1 - Math.pow(1 - progress, 3);

						chart.update();

						if (progress < 1) {
							instance._doughnutCenterImageFrame = requestAnimationFrame(animate);
						}
					};

					instance._doughnutCenterImageFrame = requestAnimationFrame(animate);
				};

				img.onerror = () => {
					instance._doughnutCenterImage = undefined;
					instance._doughnutCenterImageSrc = undefined;
				};
			}

			if (img && img.complete && img.naturalWidth > 0) {
				const iw = img.naturalWidth;
				const ih = img.naturalHeight;

				const holeSize = safeRadius * 2;

				let scale = options.imageScale;

				if (options.imageFit === 'contain') {
					scale = Math.min(holeSize / iw, holeSize / ih);
				} else if (options.imageFit === 'cover') {
					scale = Math.max(holeSize / iw, holeSize / ih);
				}

				const drawWidth = iw * scale;
				const drawHeight = ih * scale;
				const drawX = x - drawWidth / 2;
				const drawY = y - drawHeight / 2;

				ctx.globalAlpha = instance._doughnutCenterImageOpacity ?? 1;

				ctx.drawImage(
					img,
					drawX,
					drawY,
					drawWidth,
					drawHeight,
				);

				ctx.globalAlpha = 1;
			}
		}

		if (options.text) {
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = options.color;

			ctx.font = `${options.fontSize}px 'Roboto Flex Variable', sans-serif`;

			const maxWidth = safeRadius * 2;
			const measured = ctx.measureText(options.text);

			if (measured.width > maxWidth) {
				const scaleFactor = maxWidth / measured.width;
				const newSize = Math.floor(options.fontSize * scaleFactor);

				ctx.font = `${newSize}px 'Roboto Flex Variable', sans-serif`;
			}

			ctx.fillText(options.text, x, y);
		}

		ctx.restore();
	},
};
