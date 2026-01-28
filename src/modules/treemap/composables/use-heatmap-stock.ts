import { ref, type Ref, watch } from 'vue';

import { type IColorBy, type ISettings, type ITreemap, NO_GROUP, TitleKey, TitleViewVariant } from '../model';
import { useLogger } from '@/shared/service/monitoring';

type GroupBy = string;

interface IHeatmapItem {
	ticker: string;
	logoUrl: string;
	sizeValue: number;
	colorValue: number;
	displayValue: number;
	price: number;
}

interface IGroupItem {
	id: GroupBy;
	value: number;
}

export function useHeatmapStock(
	rawHeatmap: Ref<undefined, undefined> | Ref<ITreemap | null, ITreemap | null>,
	sizeBy: Ref<ISettings | null>,
	colorBy: Ref<IColorBy | null>,
	displayValue: Ref<ISettings | null>,
	groupBy: Ref<ISettings | null>,
	selectGroup: Ref<string | null>,
	titleSetting: Ref<TitleViewVariant>,
) {
	const heatmap = ref<Record<GroupBy, IHeatmapItem[]>>({});
	const group = ref<IGroupItem[]>([]);
	const isSizeValuePercent = ref(false);
	const isDisplayValuePercent = ref(false);

	const logger = useLogger();

	watch(
		[rawHeatmap, sizeBy, colorBy, titleSetting, displayValue, groupBy, selectGroup],
		([newHeatmap, newSizeBy, newColorBy, newTitle, newDisplayValue, newGroupBy]) => {
			if (
				!newHeatmap?.items.length ||
				!newSizeBy ||
				!newColorBy ||
				!newDisplayValue ||
				!newGroupBy
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

			let groupByValueKey: string = NO_GROUP.key;
			if (newGroupBy.key !== NO_GROUP.key) {
				groupByValueKey = `${newGroupBy.key}-${newSizeBy.key}`;

				const foundGroupByValue = newHeatmap.items.find(item => item.values[groupByValueKey]);
				if (!foundGroupByValue) {
					logger.debug('Not found GroupBy', { context: { groupBy: groupByValueKey } });
					return;
				}

				const foundGroupBy = newHeatmap.items.find(item => item.values[newGroupBy.key]);
				if (!foundGroupBy) {
					logger.debug('Not found GroupBy value', { context: { groupBy: newGroupBy.key } });
					return;
				}
			}

			isSizeValuePercent.value = newSizeBy.isPercent;
			isDisplayValuePercent.value = newDisplayValue.isPercent;

			heatmap.value = {};
			group.value = [];

			const groupMap = new Map<GroupBy, number>();

			newHeatmap.items.forEach(item => {
				let groupId = NO_GROUP.key as GroupBy;
				if (newGroupBy.key !== NO_GROUP.key) {
					groupId = item.values[newGroupBy.key] as GroupBy;

					groupMap.set(groupId, item.values[groupByValueKey] as number);
				} else {
					if (group.value.length === 0) {
						groupMap.set(groupId, 1);
					}
				}

				if (!heatmap.value[groupId]) {
					heatmap.value[groupId] = [{
						logoUrl: item.logoSrc,
						ticker: item[currentKeyTicker],
						sizeValue: item.values[newSizeBy.key] as number,
						colorValue: item.values[newColorBy.colorBy.key] as number,
						displayValue: item.values[newDisplayValue.key] as number,
						price: item.values.price as number,
					}];
				} else {
					heatmap.value[groupId].push({
						logoUrl: item.logoSrc,
						ticker: item[currentKeyTicker],
						sizeValue: item.values[newSizeBy.key] as number,
						colorValue: item.values[newColorBy.colorBy.key] as number,
						displayValue: item.values[newDisplayValue.key] as number,
						price: item.values.price as number,
					});
				}
			});

			if (selectGroup.value) {
				groupMap.clear();
				groupMap.set(selectGroup.value, 1);

				heatmap.value = {
					[selectGroup.value]: heatmap.value[selectGroup.value],
				};
			}

			group.value = Array.from(groupMap, ([key, value]) => ({ id: key, value: value }));
		},

		{ immediate: true },
	);

	return {
		heatmap,
		group,
		isSizeValuePercent,
		isDisplayValuePercent,
	};
}
