import type { Chart, Plugin } from 'chart.js';
import { notNullish } from '@vueuse/core';
import type { LineAnnotationOptions } from 'chartjs-plugin-annotation';

export type PreventLabelOverlapPluginOptions = {
	/**
	 * ScaleId, на котором рисуются лейблы аннотации.
	 * Будет использовано, если не получится высчитать автоматически
	 * @default y
	 */
	scale: string;

	/**
	 * Высота лейбла в пикселях, если не получится высчитать автоматически
	 * @default 16
	 */
	height: number;

	/**
	 * Пространство между лейблами в пикселях
	 * @default 1
	 */
	spacing: number;

	/**
	 * Минимальный отступ от нижней границы графика
	 */
	chartBottomPadding: number;
};

type ChartWithLabelOverlapContext = Chart<'line'> & {
	_labelOverlap: {
		updatingAnnotations: boolean;
	};
};

type PositionedLabel = {
	id?: string;
	y: number;
	height: number;
};

/**
 * Предотвратить перекрытие лейблов на Line Chart.
 * Работает с Line Annotation из chartjs-plugin-annotation.
 * Подразумевается, что Line Annotation имеет yMin.
 * @see https://www.chartjs.org/chartjs-plugin-annotation/latest/guide/types/line.html
 */
export const preventLabelOverlapPlugin: Plugin<'line', PreventLabelOverlapPluginOptions> = {
	id: 'preventLabelOverlap',
	defaults: {
		scale: 'y',
		height: 16,
		spacing: 1,
		chartBottomPadding: 10,
	},
	beforeInit(chart: ChartWithLabelOverlapContext) {
		chart._labelOverlap = {
			updatingAnnotations: false,
		};
	},
	afterLayout(chart: ChartWithLabelOverlapContext, _args, options) {
		if (chart._labelOverlap.updatingAnnotations) {
			return;
		}

		const { annotations } = chart.options.plugins?.annotation ?? {};
		if (!annotations) {
			return;
		}

		const annotationsList = Array.isArray(annotations) ? annotations : Object.values(annotations);
		const positionedLabels = [] as PositionedLabel[];

		const { spacing, chartBottomPadding } = options;
		const chartBottomBoundary = chart.chartArea.bottom;

		type AnnotationEntry = {
			annotation: NonNullable<typeof annotationsList[number]>;
			naturalPixel: number;
			height: number;
		};

		const validAnnotations: AnnotationEntry[] = [];

		for (const annotation of annotationsList) {
			if (!notNullish(annotation)) {
				continue;
			}

			if (annotation.type !== 'line' || annotation.display === false) {
				continue;
			}

			const { label } = annotation;
			if (!label) {
				continue;
			}

			const scale = chart.scales[annotation.yScaleID as string | undefined ?? options.scale];
			if (!scale) {
				continue;
			}

			const naturalPixel = scale.getPixelForValue(label.yMin!);
			const height = label.content instanceof HTMLCanvasElement
				? label.content.height
				: ((label.height as number | undefined) ?? options.height);

			validAnnotations.push({ annotation, naturalPixel, height });
		}

		validAnnotations.sort((a, b) => a.naturalPixel - b.naturalPixel);

		for (const { annotation, naturalPixel, height } of validAnnotations) {
			const { label } = annotation as LineAnnotationOptions;
			const pixel = naturalPixel + (label!.yAdjust ?? 0);

			let overlapIsFound = false;
			let safetyCounter = 0;

			let adjust = pixel;

			do {
				overlapIsFound = false;

				for (const pLabel of positionedLabels) {
					if (adjust < pLabel.y + pLabel.height + spacing && adjust + height + spacing > pLabel.y) {
						adjust = pLabel.y + pLabel.height + spacing;
						overlapIsFound = true;

						if (adjust + height > chartBottomBoundary) {
							adjust = chartBottomBoundary - height - chartBottomPadding;
						}
					}
				}

				safetyCounter++;
				if (safetyCounter >= 50) {
					break;
				}

			} while (overlapIsFound);

			if (adjust + height > chartBottomBoundary) {
				adjust = chartBottomBoundary - height - chartBottomPadding;
			}

			label!.yAdjust = (label!.yAdjust ?? 0) + adjust - pixel;

			positionedLabels.push({
				id: annotation.id,
				y: adjust,
				height,
			});
		}

		positionedLabels.sort((a, b) => a.y - b.y);
		positionedLabels.forEach((label, index) => {
			const annotation = annotationsList.find(ant => ant?.id === label.id);
			if (annotation) {
				annotation.z = index + 1;
			}
		});

		chart._labelOverlap.updatingAnnotations = true;

		/**
		 * Перерисовываем labels c помощью обновления графика
		 */
		chart.update();

		chart._labelOverlap.updatingAnnotations = false;
	},
};
