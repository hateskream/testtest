import { ref, watch, type Ref } from 'vue';

import { TitleKey, TitleViewVariant, type IColorBy, type ISettings, type ITreemap } from '../model';

interface IHeatmapItem {
	ticker: string;
	logoUrl: string;
	sizeValue: number;
	colorValue: number;
	displayValue: number;
	price: number;
}

export function useHeatmapCrypto(
	rawHeatmap: Ref<undefined, undefined> | Ref<ITreemap | null, ITreemap | null>,
	sizeBy: Ref<ISettings | null>,
	colorBy: Ref<IColorBy | null>,
	displayValue: Ref<ISettings | null>,
	titleSetting: Ref<TitleViewVariant>,
) {
	const heatmap = ref<IHeatmapItem[]>([]);
	const isSizeValuePercent = ref(false);
	const isDisplayValuePercent = ref(false);

	watch(
		[rawHeatmap, sizeBy, colorBy, titleSetting, displayValue],
		([newHeatmap, newSizeBy, newColorBy, newTitle, newDisplayValue]) => {
			if (
				!newHeatmap?.items.length ||
				!newSizeBy ||
				!newColorBy ||
				!newDisplayValue
			) {
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

			const foundDisplayValue = newHeatmap.items.find(item => item.values[newDisplayValue.key]);
			if (!foundDisplayValue) {
				// eslint-disable-next-line no-console
				console.log('notFoundDisplayValue', foundDisplayValue);
				return;
			}

			let currentKeyTicker = TitleKey.TICKER;
			if (newTitle === TitleViewVariant.NAME) {
				currentKeyTicker = TitleKey.NAME;
			}

			const foundTicker = newHeatmap.items.find(item => item[currentKeyTicker]);
			if (!foundTicker) {
				// eslint-disable-next-line no-console
				console.log('notFoundTicker', foundTicker);
				return;
			}

			isSizeValuePercent.value = newSizeBy.isPercent;
			isDisplayValuePercent.value = newDisplayValue.isPercent;

			heatmap.value = newHeatmap.items.map(item => ({
				logoUrl: item.logoSrc,
				ticker: item[currentKeyTicker],
				sizeValue: item.values[newSizeBy.key],
				colorValue: item.values[newColorBy.colorBy.key],
				displayValue: item.values[newDisplayValue.key],
				price: item.values.price,
			}),
			);
		},
		{ immediate: true },
	);

	return {
		heatmap,
		isSizeValuePercent,
		isDisplayValuePercent,
	};
}
