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

		if (limit >= _points.length) {
			return _points;
		}

		const step = Math.ceil(_points.length / limit);

		return _points.filter((_, key) => key % step === 0);
	});

	return {
		points: filteredPoints,
	};
}
