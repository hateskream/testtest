import { ref, watch, type Ref } from 'vue';

import { TitleKey, TitleViewVariant, type IColorBy, type IHeatmap, type ISettings } from '../model';

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
