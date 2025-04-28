import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { type IFilterNews, type INewsLocation } from '../model';
import { NEWS_LOCATIONS, NEWS_FILTERS } from '../const';
import { type IFilterList } from '../../base/model/filter-modal';
import { compareStrings } from '@/shared/lib';

export const useNewsStore = defineStore('dashboards-news', () => {
	const isShowDate = ref(true);

	const isShowSource = ref(true);

	const isShowDesc = ref(true);

	const isShowAuthor = ref(true);

	const isShowSymbols = ref(true);

	const isShowScore = ref(true);

	const isShowSentiment = ref(true);

	const filters = ref<IFilterNews>(NEWS_FILTERS);

	const activeFilters = computed(() =>
		Object.fromEntries(
			Object.entries(filters.value).filter(([key, item]) => item.value.length > 0),
		),
	);

	const locationFilters = ref<INewsLocation[]>(NEWS_LOCATIONS);

	const activeLocationFilters = computed(() => {
		const countries: { region: string; countries: string[] }[] = [];

		locationFilters.value.forEach(location => {
			if (location.isActive) {
				const countryActiveCodes: string[] = [];

				location.countries.forEach(country => {
					country.isActive && countryActiveCodes.push(country.code);
				});

				countries.push({
					region: location.region,
					countries: countryActiveCodes,
				});
			}
		});

		return countries;
	});

	function toggleFiltersList(key: keyof IFilterNews | string, value: string) {
		// @ts-expect-error no-error, only for ts
		const filterActive = filters.value[key] as IFilterList<string>;

		const filterActiveValueIdx = filterActive.value.findIndex(item =>
			compareStrings(item, value),
		);

		if (filterActive.multiple) {
			if (filterActiveValueIdx > -1) {
				filterActive.value.splice(filterActiveValueIdx, 1);
			} else {
				filterActive.value.push(value);
			}
		} else if (filterActiveValueIdx === -1) {
			filterActive.value = [value];
		}
	}

	function toggleShowDate() {
		isShowDate.value = !isShowDate.value;
	}

	function toggleShowSource() {
		isShowSource.value = !isShowSource.value;
	}

	function toggleShowDesc() {
		isShowDesc.value = !isShowDesc.value;
	}

	function toggleShowAuthor() {
		isShowAuthor.value = !isShowAuthor.value;
	}

	function toggleShowSymbols() {
		isShowSymbols.value = !isShowSymbols.value;
	}

	function toggleShowScore() {
		isShowScore.value = !isShowScore.value;
	}

	function toggleShowSentiment() {
		isShowSentiment.value = !isShowSentiment.value;
	}

	function resetAll() {
		isShowDate.value = true;
		isShowSource.value = true;
		isShowDesc.value = true;
		isShowAuthor.value = true;
		isShowSymbols.value = true;
		isShowScore.value = true;
		isShowSentiment.value = true;

		locationFilters.value = NEWS_LOCATIONS;
		filters.value = NEWS_FILTERS;
	}

	return {
		isShowDate,
		isShowSource,
		isShowDesc,
		isShowAuthor,
		isShowSymbols,
		isShowScore,
		isShowSentiment,
		locationFilters,

		activeFilters,

		activeLocationFilters,
		toggleFiltersList,

		filters,

		resetAll,

		toggleShowDate,
		toggleShowSource,
		toggleShowDesc,
		toggleShowAuthor,
		toggleShowSymbols,
		toggleShowScore,
		toggleShowSentiment,
	};
});
