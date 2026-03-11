import { type MaybeRefOrGetter, computed, shallowRef, watch } from 'vue';

import { getDefaultCurrency, getDefaultYears } from '../model';
import { useQuerySeasonals } from '../queries';

export function useSeasonsals(tickerId: MaybeRefOrGetter<string>) {
	const currency = shallowRef(getDefaultCurrency());
	const selectedYears = shallowRef(getDefaultYears());

	const { data, isLoading, isError, refetch } = useQuerySeasonals(
		tickerId,
		currency,
	);

	const availableYears = computed((): number[] => {
		if (!data.value) {
			return [];
		}

		return data.value.series.map((s) => s.year).sort((a, b) => a - b);
	});

	watch(availableYears, (years) => {
		if (!years.length) {
			return;
		}

		const validYears = selectedYears.value.filter((y) => years.includes(y));

		if (validYears.length) {
			selectedYears.value = validYears;
		} else {
			selectedYears.value = getDefaultYears().filter((y) => years.includes(y));

			if (!selectedYears.value.length) {
				selectedYears.value = years.slice(-2);
			}
		}
	});

	const filteredData = computed(() => {
		if (!data.value) {
			return undefined;
		}

		return {
			...data.value,
			series: data.value.series.filter((s) =>
				selectedYears.value.includes(s.year),
			),
		};
	});

	return {
		selectedYears,
		availableYears,
		data: filteredData,
		isLoading,
		isError,
		refetch,
	};
}
