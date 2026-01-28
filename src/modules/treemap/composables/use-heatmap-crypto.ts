import { ref, type Ref, watch } from 'vue';

import { type IColorBy, type ISettings, type ITreemap, TitleKey, TitleViewVariant } from '../model';
import { useLogger } from '@/shared/service/monitoring';

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

	const logger = useLogger();

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
				logger.debug('Not found SizeBy', { context: { sizeBy: newSizeBy.key } });
				return;
			}

			const foundColorBy = newHeatmap.items.find(item => item.values[newColorBy.colorBy.key]);
			if (!foundColorBy) {
				logger.debug('Not found ColorBy', { context: { colorBy: newColorBy.colorBy.key } });
				return;
			}

			const foundDisplayValue = newHeatmap.items.find(item => item.values[newDisplayValue.key]);
			if (!foundDisplayValue) {
				logger.debug('Not found DisplayValue', { context: { displayValue: newDisplayValue.key } });
				return;
			}

			let currentKeyTicker = TitleKey.TICKER;
			if (newTitle === TitleViewVariant.NAME) {
				currentKeyTicker = TitleKey.NAME;
			}

			const foundTicker = newHeatmap.items.find(item => item[currentKeyTicker]);
			if (!foundTicker) {
				logger.debug('Not found Ticker', { context: { ticker: currentKeyTicker } });
				return;
			}

			isSizeValuePercent.value = newSizeBy.isPercent;
			isDisplayValuePercent.value = newDisplayValue.isPercent;

			heatmap.value = newHeatmap.items.map(item => ({
				logoUrl: item.logoSrc,
				ticker: item[currentKeyTicker],
				sizeValue: item.values[newSizeBy.key] as number,
				colorValue: item.values[newColorBy.colorBy.key] as number,
				displayValue: item.values[newDisplayValue.key] as number,
				price: item.values.price as number,
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
