import { ref, type Ref, watch } from 'vue';

import { type IColorBy, type IHeatmap, type ISettings, TitleKey, TitleViewVariant } from '../model';
import { useLogger } from '@/shared/service/monitoring';

interface ITreeMapItemValue {
	display: number;
	color: number;
}

interface IHeatmapItem {
	ticker: string;
	logoUrl: string;
	values: ITreeMapItemValue[];
}

export function useHeatmapForex(
	rawHeatmap: Ref<undefined, undefined> | Ref<IHeatmap | null, IHeatmap | null>,
	colorBy: Ref<IColorBy | null>,
	displayValue: Ref<ISettings | null>,
	titleSetting: Ref<TitleViewVariant>,
) {
	const heatmap = ref<IHeatmapItem[]>([]);
	const isDisplayValuePercent = ref(false);

	const logger = useLogger();

	watch(
		[rawHeatmap, colorBy, titleSetting, displayValue],
		([newHeatmap, newColorBy, newTitle, newDisplayValue]) => {
			if (
				!newHeatmap?.items.length ||
				!newColorBy ||
				!newDisplayValue
			) {
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

			isDisplayValuePercent.value = newDisplayValue.isPercent;

			heatmap.value = newHeatmap.items.map(item => {
				const { logoSrc, values } = item;
				const color = values[newColorBy.colorBy.key];
				const display = values[newDisplayValue.key];

				const itemValues: ITreeMapItemValue[] = color.map((colorValue, index) => ({
					color: colorValue,
					display: display[index],
				}));

				return {
					logoUrl: logoSrc,
					ticker: item[currentKeyTicker],
					values: itemValues,
				};
			});
		},
		{ immediate: true },
	);

	return {
		heatmap,
		isDisplayValuePercent,
	};
}
