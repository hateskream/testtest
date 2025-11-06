import { z } from 'zod';
import { computed, ref, watch } from 'vue';

import { createStateQueries } from '@/shared/service/data-repo';
import {
	ColumnType,
	hydrateColumns,
	type IHydratedColumn,
	type ISort,
	type ITableColumn,
	rehydrateColumns,
} from '@/modules/cell';
import {
	FilterOperator,
	type Filters,
	type FiltersDefinition,
	type FiltersState,
	getDefaultSettings,
	getDefaultState,
	hydrateFilters,
	type IFilterHydrateState,
	type ISettings,
	type IState,
	PRESETS,
	rehydrateFilters,
	ScreenerMarket,
	ScreenerType,
} from '../model';

const columnSchema = z.object({
	columnType: z.nativeEnum(ColumnType),
	isShow: z.boolean(),
	order: z.number(),
});

const filterSchema = z.object({
	filterType: z.string(),
	selected: z.object({
		operator: z.nativeEnum(FilterOperator),
		right: z.array(z.number().or(z.string())).or(z.string()).or(z.number()),
	}).or(z.null()),
	presetId: z.string().or(z.undefined()),
});

const settingsSchema = z.object({
	column: z.array(columnSchema),
	sort: z.object({
		columnType: z.string(),
		sortDirection: z.string(),
	}).nullish(),
	filters: z.array(filterSchema),
	markets: z.array(z.nativeEnum(ScreenerType).or(z.nativeEnum(ScreenerMarket))),
});

export const stateSchema = z.object({
	activeScreenerType: z.nativeEnum(ScreenerType),
	settings: z.object({
		[ScreenerType.Stock]: settingsSchema,
		[ScreenerType.Crypto]: settingsSchema,
		[ScreenerType.ETF]: settingsSchema,
		[ScreenerType.Bond]: settingsSchema,
		[ScreenerType.CEX]: settingsSchema,
		[ScreenerType.DEX]: settingsSchema,
	}),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

interface IOptions {
	isEphemeral: boolean;
	defaultStateType?: ScreenerType;
}

export function useScreener({ isEphemeral, defaultStateType = ScreenerType.Stock }: IOptions) {
	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__SCREENER__',
		isSaveChange: !isEphemeral,
		getDefaultState: () => getDefaultState(defaultStateType),
		entityId: 'SCREENER',
		schema: stateSchema,
		hydrateFn: hydrate,
		rehydrateFn: rehydrate,
		urlGet: '',
		urlSet: '',
	});

	const { data: dataState } = useStateQuery();
	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState(defaultStateType));

	const currentSettings = ref<ISettings>(getDefaultSettings(defaultStateType));

	const columns = computed({
		get: () => currentSettings.value.column,
		set: (val: ITableColumn[]) => {
			currentSettings.value.column = val;
		},
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = JSON.parse(JSON.stringify(newState));
			currentSettings.value = state.value.settings[state.value.activeScreenerType];
		}
	}, { immediate: true });

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	watch(
		() => state.value.activeScreenerType,
		type => {
			currentSettings.value = state.value.settings[type];
		},
		{ immediate: true });

	watch(
		currentSettings,
		newSettings => {
			state.value.settings[state.value.activeScreenerType] = newSettings;
		},
	);

	function resetAllChanges() {
		state.value = getDefaultState(defaultStateType);
	}

	const activeSort = computed({
		get: () => currentSettings.value.sort,
		set: (sort: ISort | null) => {
			currentSettings.value.sort = sort;
		},
	});

	const filtersState = computed({
		get(): FiltersState {
			return Object.entries(currentSettings.value.filters).reduce(
				(acc, [filter, filterState]) => ({
					...acc,
					[filter]: filterState.state,
				}),
				{},
			);
		},
		set(updatedState: FiltersState) {
			currentSettings.value.filters = Object.entries(currentSettings.value.filters)
				.reduce((acc, [filter, field]) => {
					acc[filter] = {
						config: field.config,
						state: updatedState[filter],
					};

					return acc;
				}, {} as Partial<Filters>) as Filters;
		},
	});

	const filtersDefinitions = computed(() => Object.entries(currentSettings.value.filters).reduce(
		(acc, [filter, definition]) => {
			acc[filter] = definition.config;

			return acc;
		}, {} as FiltersDefinition,
	));

	const activeMarkets = computed({
		get: () => currentSettings.value.markets,
		set: (val: ScreenerMarket[]) => {
			currentSettings.value.markets = val;
		},
	});

	const activeScreenerType = computed({
		get: () => state.value.activeScreenerType,
		set: (val: ScreenerType) => {
			state.value.activeScreenerType = val;
		},
	});

	return {
		activeScreenerType,
		columns,
		filtersState,
		filtersDefinitions,
		applyStateToParent,
		resetAllChanges,
		activeMarkets,
		activeSort,
	};
}

function rehydrate(
	data: StateSchemaType,
): IState {
	return {
		activeScreenerType: data.activeScreenerType,
		settings: Object.fromEntries(
			Object
				.entries(data.settings)
				.map(
					([key, { column, filters, sort, markets }]) => [
						key as ScreenerType,
						{
							column: rehydrateColumns(
								column,
								PRESETS[key as ScreenerType].columns,
							),
							filters: rehydrateFilters(
								filters as IFilterHydrateState[],
								PRESETS[key as ScreenerType].filters,
							),
							sort: sort,
							markets: [...markets],
						},
					],
				),
		) as IState['settings'],
	};
}

function hydrate(data: IState): StateSchemaType {
	type SettingsType = {
		[key in ScreenerType]: {
			column: IHydratedColumn[];
			filters: IFilterHydrateState[];
			sort: ISort | null;
			markets: (ScreenerMarket | ScreenerType)[];
		};
	};

	return {
		activeScreenerType: data.activeScreenerType,
		settings: Object.fromEntries(
			Object
				.entries(data.settings)
				.map(
					([key, value]) => [
						key,
						{
							column: hydrateColumns(value.column),
							filters: hydrateFilters(value.filters),
							sort: value.sort,
							markets: [...value.markets],
						},
					],
				),
		) as SettingsType,
	};
}
