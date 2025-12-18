import { type MaybeElementRef, useElementSize } from '@vueuse/core';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

export interface IUseAdaptiveBarPointsOptions {
	barWidth?: number;
	minSpaceWidth?: number;
}

export function useAdaptiveBarPoints<T = unknown[]>(
	points: MaybeRefOrGetter<T[]>,
	container: MaybeElementRef,
	options: IUseAdaptiveBarPointsOptions = {},
) {
	const { barWidth = 15, minSpaceWidth = 15 } = options;

	const { width: chartContainerWidth } = useElementSize(container);

	const maxPointsCount = computed(() => {
		return Math.round(chartContainerWidth.value / (barWidth + minSpaceWidth));
	});

	const filteredPoints = computed(() => {
		const limit = maxPointsCount.value;
		const _points = toValue(points);
		const total = _points.length;

		if (limit >= total) {
			return _points;
		}

		const result: typeof _points = [];
		const step = (total - 1) / (limit - 1);

		for (let i = 0; i < limit; i += 1) {
			const index = Math.round(i * step);
			result.push(_points[index]);
		}

		return result;
	});

	return {
		points: filteredPoints,
	};
}
