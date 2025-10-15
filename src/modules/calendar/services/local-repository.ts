import { useUrlSearchParams } from '@vueuse/core';

import { BaseRepository } from './base-repository.ts';
import { type ToolbarSchemaType } from './schema.ts';
import { EventType, getDefaultState, Impact, MarketIds } from '../models';

export interface ILocalRepositoryOptions {
	useQuery: boolean;
	defaultState: () => ToolbarSchemaType;
}

interface IParams {
	country?: MarketIds;
	impact?: Impact;
	event?: EventType;
	catalog?: string;
	section?: string;
}

export class LocalRepository extends BaseRepository {
	private static instances: Map<string, LocalRepository> = new Map();
	private readonly storageKey: string;
	private readonly params: IParams;

	private constructor(
		private readonly _storageKey: string,
		widgetId: string,
		private readonly options?: ILocalRepositoryOptions,
	) {
		super();

		this.storageKey = `${this._storageKey}${widgetId}`;
		this.params = options?.useQuery ? useUrlSearchParams<IParams>('history') : {};
	}

	public static create(
		storageKey: string,
		widgetId: string,
		options?: ILocalRepositoryOptions,
	): LocalRepository {
		if (!this.instances.has(widgetId)) {
			this.instances.set(widgetId, new LocalRepository(storageKey, widgetId, options));
		}
		return this.instances.get(widgetId)!;
	}

	private mergeWithQuery(state: ToolbarSchemaType): ToolbarSchemaType {
		if (!this.options?.useQuery) {
			return state;
		}

		return {
			...state,
			marketId: this.params.country ?? state.marketId,
			impact: this.params.impact ?? state.impact,
			eventType: this.params.event ?? state.eventType,
			watchlistId: this.params.catalog ?? state.watchlistId,
			watchlistSection: this.params.section ?? state.watchlistSection,
		};
	}

	protected async getter(): Promise<ToolbarSchemaType> {
		const raw = localStorage.getItem(this.storageKey);
		let state: ToolbarSchemaType;

		if (raw === null) {
			state = this.options?.defaultState() || getDefaultState();
		} else {
			state = JSON.parse(raw) as ToolbarSchemaType;
		}

		const merged = this.mergeWithQuery(state);
		this.check(merged);
		return merged;
	}

	protected async setter(state: ToolbarSchemaType) {
		this.check(state);

		const raw = JSON.stringify(state);
		localStorage.setItem(this.storageKey, raw);

		if (this.options?.useQuery) {
			this.params.country = state.marketId !== MarketIds.EntireWorld ? state.marketId : undefined;
			this.params.impact = state.impact !== Impact.All ? state.impact : undefined;
			this.params.event = state.eventType !== EventType.All ? state.eventType : undefined;
			this.params.catalog = state.watchlistId ?? undefined;
			this.params.section = state.watchlistSection ?? undefined;
		}
	}
}
