import type { MarketType } from '@/modules/market';
import {
	hydrateColumns,
	hydrateFilters,
	PRESETS,
	rehydrateColumns,
	rehydrateFilters,
	type IColumnHydrateState,
	type IFilterHydrateState,
	type IState,
} from '../model';
import { FailedParse } from './error';
import { stateSchema, type StateSchemaType } from './validator';
import type { ISort } from '@/modules/cell';

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
			activeMarket: data.activeMarket,
			settings: Object.fromEntries(
				Object
					.entries(data.settings)
					.map(
						([key, { column, filters, sort }]) => [
							key,
							{
								column: rehydrateColumns(
									column,
									PRESETS[key as MarketType].columns,
								),
								filters: rehydrateFilters(
									filters,
									PRESETS[key as MarketType].filters,
								),
								sort: sort,
							},
						],
					),
			) as IState['settings'],
		};
	}

	protected hydrate(data: IState): StateSchemaType {
		type SettingsType = {
			[key in MarketType]: {
				column: IColumnHydrateState[];
				filters: IFilterHydrateState[];
				sort: ISort | null;
			};
		};

		const hydrated = {
			activeMarket: data.activeMarket,
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
