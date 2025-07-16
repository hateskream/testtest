import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { type IFilterNews, type INewsLocation, type INewsSort } from '../model';
import { NEWS_LOCATIONS, NEWS_FILTERS } from '../const';
import { compareStrings } from '@/shared/lib';
import { getImagePath, ImageTypePath } from '@/shared/lib/get-image-path';
import type {
	IFilterList,
	IModalFilterTicker,
	IModalFilterTickerLists,
} from '../../base/modal/model';

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
			Object.entries(filters.value).filter(([_key, item]) => item.value.length > 0),
		),
	);

	const locationFilters = ref<INewsLocation[]>(NEWS_LOCATIONS);

	const sortBy = ref<INewsSort[]>([
		{
			key: 'date',
			order: 'asc',
			value: false,
			name: 'Date',
			span: 'Newest first',
		},
		{
			key: 'date',
			order: 'desc',
			value: false,
			name: 'Date',
			span: 'Oldest first',
		},
		{
			key: 'source',
			order: 'asc',
			value: false,
			name: 'Source popularity',
		},
		{
			key: 'importance',
			order: 'asc',
			value: false,
			name: 'Importance',
		},
	]);

	const activeSort = computed<INewsSort | undefined>(() =>
		sortBy.value.find(item => item.value === true),
	);

	const tickerLists = ref<IModalFilterTickerLists>({
		Cryptocurrencies: [
			{
				id: '1',
				image: getImagePath('TRON', ImageTypePath.Currency),
				name: 'Tron',
				ticker: 'TRX',
				isSelected: false,
			},
			{
				id: '2',
				image: getImagePath('ADA', ImageTypePath.Currency),
				name: 'Cardano',
				ticker: 'ADA',
				isSelected: false,
			},
			{
				id: '3',
				image: getImagePath('BNB', ImageTypePath.Currency),
				name: 'BNB',
				ticker: 'BNB',
				isSelected: false,
			},
			{
				id: '4',
				image: getImagePath('SOL', ImageTypePath.Currency),
				name: 'Solana',
				ticker: 'SOL',
				isSelected: false,
			},
		],

		Stocks: [
			{
				id: '5',
				image: getImagePath('TSLA', ImageTypePath.Stock),
				name: 'Tesla Inc',
				ticker: 'TSLA',
				isSelected: false,
			},
			{
				id: '6',
				image: getImagePath('META', ImageTypePath.Stock),
				name: 'Meta Platforms',
				ticker: 'META',
				isSelected: false,
			},
			{
				id: '7',
				image: getImagePath('TSLA', ImageTypePath.Stock),
				name: 'Apple Inc',
				ticker: 'AAPL',
				isSelected: false,
			},
		],
	});

	const activeTickersList = computed<IModalFilterTicker[]>(() =>
		Object.values(tickerLists.value)
			.flat()
			.filter(item => item.isSelected),
	);

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

	function setTickerLists(newList: IModalFilterTickerLists) {
		tickerLists.value = newList;
	}

	function setSort(sortItem: INewsSort) {
		sortBy.value = sortBy.value.map(item => {
			if (
				compareStrings(item.key, sortItem.key) &&
				compareStrings(item.order, sortItem.order)
			) {
				return {
					...item,
					value: !sortItem.value,
				};
			}

			return {
				...item,
				value: false,
			};
		});
	}

	function toggleLocationRegionFilter(region: string) {
		const locationIdx = locationFilters.value.findIndex(item =>
			compareStrings(region, item.region),
		)!;

		const isActive = !locationFilters.value[locationIdx].isActive;

		const countries = locationFilters.value[locationIdx].countries.map(item => ({
			...item,
			isActive,
		}));

		locationFilters.value[locationIdx] = {
			...locationFilters.value[locationIdx],
			countries,
			isActive,
		};
	}

	function toggleLocationCountryFilter(region: string, countryCode: string) {
		const locationIdx = locationFilters.value.findIndex(item =>
			compareStrings(region, item.region),
		)!;

		let activeCountries = 0;

		const countries = locationFilters.value[locationIdx].countries.map(item => {
			if (compareStrings(countryCode, item.code)) {
				if (!item.isActive) {
					activeCountries += 1;
				}

				return {
					...item,
					isActive: !item.isActive,
				};
			}

			if (item.isActive) {
				activeCountries += 1;
			}

			return item;
		});

		const isActive = activeCountries !== 0;

		locationFilters.value[locationIdx] = {
			...locationFilters.value[locationIdx],
			countries,
			isActive,
		};
	}

	function toggleFiltersList(key: keyof IFilterNews | string, value: string) {
		const filterActive = filters.value[key as keyof IFilterNews] as IFilterList<string>;

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
		toggleLocationCountryFilter,
		toggleLocationRegionFilter,

		tickerLists,
		activeTickersList,
		setTickerLists,

		filters,
		sortBy,

		resetAll,
		activeSort,
		setSort,

		toggleShowDate,
		toggleShowSource,
		toggleShowDesc,
		toggleShowAuthor,
		toggleShowSymbols,
		toggleShowScore,
		toggleShowSentiment,
	};
});
