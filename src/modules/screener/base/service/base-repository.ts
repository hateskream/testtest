import {
	hydrateFilters,
	type IFilterHydrateState,
	type IState,
	PRESETS,
	rehydrateFilters,
	ScreenerMarket,
	ScreenerType,
} from '../model';
import { FailedParse } from './error';
import { stateSchema, type StateSchemaType } from './validator';
import { hydrateColumns, type IHydratedColumn, type ISort, rehydrateColumns } from '@/modules/cell';

export abstract class BaseRepository {
	protected abstract getter(): Promise<StateSchemaType>;
	protected abstract setter(state: StateSchemaType): Promise<void>;

	protected check(data: StateSchemaType): void {
		const { success, error } = stateSchema.safeParse(data);

		if (!success) {
			throw new FailedParse(`Failed to parse settings\nError: ${error}`);
		}
	}

	protected rehydrate(data: StateSchemaType): IState {
		this.check(data);

		return {
			activeScreenerType: data.activeScreenerType,
			settings: Object.fromEntries(
				Object
					.entries(data.settings)
					.map(
						([key, { column, filters, sort, markets }]) => [
							key,
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

	protected hydrate(data: IState): StateSchemaType {
		type SettingsType = {
			[key in ScreenerType]: {
				column: IHydratedColumn[];
				filters: IFilterHydrateState[];
				sort: ISort | null;
				markets: (ScreenerMarket | ScreenerType)[];
			};
		};

		const hydrated = {
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

		this.check(hydrated);

		return hydrated;
	}

	public async get(): Promise<IState> {
		const data = await this.getter();
		return this.rehydrate(data);
	}

	public async set(state: IState): Promise<StateSchemaType> {
		const hydrated = this.hydrate(state);
		await this.setter(hydrated);

		return hydrated;
	}
}
