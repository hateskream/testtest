/* eslint-disable no-plusplus */
import { computed, type Ref } from 'vue';

export interface IDepthRange {
	start: number;
	end: number;
}

type DepthLevel =
'negative3' |
'negative2' |
'negative1' |
'positive1' |
'positive2' |
'positive3' |
'moreStart';

type DepthIntervalsType = Record<DepthLevel, IDepthRange>;

const colorsDepth: Record<DepthLevel, string> = {
	negative3: 'rgba(226, 28, 28, 1)',
	negative2: 'rgba(156, 18, 13, 1)',
	negative1: 'rgba(95, 21, 17, 1)',
	positive1: 'rgba(27, 27, 29, 1)',
	positive2: 'rgba(17, 74, 55, 1)',
	positive3: 'rgba(21, 129, 94, 1)',
	moreStart: 'rgba(0, 184, 123, 1)',
};

export function useDepth(depthRange: Ref<IDepthRange>) {
	const depthIntervals = computed((): DepthIntervalsType => {
		const { start, end } = depthRange.value;

		const interval = 5;

		const intervals: Record<string, IDepthRange> = {};

		const intervalLength = (
			Math.abs(start) +
			Math.abs(end)
		) / interval;

		let index = 0;
		const indexNegativeInitial = (interval + 1) / 2;
		let indexNegative = indexNegativeInitial;

		while (indexNegative > 0) {
			intervals[`negative${indexNegative}`] =
				indexNegative === indexNegativeInitial
					? {
						start: -Infinity,
						end,
					}
					: {
						start: end + (index - 1) * intervalLength,
						end: end + index * intervalLength,
					};

			index++;
			indexNegative--;
		}

		let indexPositive = 1;
		while (index <= interval) {
			intervals[`positive${indexPositive}`] = {
				start: end + (index - 1) * intervalLength,
				end: end + (index) * intervalLength,
			};

			index++;
			indexPositive++;
		}

		intervals.moreStart = {
			start,
			end: Infinity,
		};

		return intervals as DepthIntervalsType;
	});

	function getDepthKey(value: number): DepthLevel {
		for (const [key, range] of Object.entries(depthIntervals.value)) {
			if (value >= range.start && value < range.end) {
				return key as DepthLevel;
			}
		}

		return 'negative1';
	}

	function getColorByValue(value: number): string {
		const key = getDepthKey(value);
		return colorsDepth[key];
	}

	return {
		getColorByValue,
	};
}
