import { ref, watch, type Ref } from 'vue';

import type { IColorBy, ISettings, ITreemap } from '../model';

interface IHeatmapItem {
	ticker: string;
	logoUrl: string;
	sizeValue: number;
	colorValue: number;
	price: number;
}

export function useHeatmap(
	rawHeatmap: Ref<undefined, undefined> | Ref<ITreemap | null, ITreemap | null>,
	sizeBy: Ref<ISettings | null>,
	colorBy: Ref<IColorBy | null>,
) {
	const heatmap = ref<IHeatmapItem[]>([]);
	const isPercent = ref(false);

	watch(
		[rawHeatmap, sizeBy, colorBy],
		([newHeatmap, newSizeBy, newColorBy]) => {
			if (!newHeatmap?.items.length || !newSizeBy || !newColorBy) {
				return;
			}

			const foundSizeBy = newHeatmap.items.find(item => item.values[newSizeBy.key]);
			if (!foundSizeBy) {
				// eslint-disable-next-line no-console
				console.log('notFoundSizeBy', foundSizeBy);
				return;
			}

			const foundColorBy = newHeatmap.items.find(item => item.values[newColorBy.colorBy.key]);
			if (!foundColorBy) {
				// eslint-disable-next-line no-console
				console.log('notFoundColorBy', foundColorBy);
				return;
			}

			isPercent.value = newSizeBy.isPercent || newColorBy.colorBy.isPercent;

			heatmap.value = newHeatmap.items.map(item => ({
				logoUrl: item.logoSrc,
				ticker: item.ticker,
				sizeValue: item.values[newSizeBy.key],
				colorValue: item.values[newColorBy.colorBy.key],
				price: item.values.price,
			}),
			);
		},
		{ immediate: true },
	);

	return {
		heatmap,
		isPercent,
	};
}
