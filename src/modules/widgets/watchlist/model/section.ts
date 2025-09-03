import { mapRow, type TableRow } from '@/modules/cell';
import type { ISection as ISectionWatchlist } from '@/modules/watchlist';

export interface ISectionUi extends ISectionWatchlist {
	isOpen: boolean;
}

export interface ISection {
	id: string;
	isOpen: boolean;
}

export function fromWatchlistToUiSections(sections: ISectionWatchlist[]): ISectionUi[] {
	return sections.map(section => ({ ...section, isOpen: false }));
}

export function createSectionsFromWatchlists(
	wsections: ISectionWatchlist[], sections: ISection[],
): ISectionUi[] {
	return wsections.map(section => {
		const { isOpen = true } = sections.find(s => s.id === section.id) || {};

		return {
			...section,
			isOpen,
		};
	});
}

export function mapSections(sections: ISectionUi[], tickers: TableRow[]) {
	return sections
		.map(({ id, name, isOpen, tickerIds }) => ({
			id,
			title: name,
			isCollapsed: isOpen,
			rows: tickerIds
				.map(tickerId => {
					const row = tickers.find(t => t.tickerId === tickerId);
					if (row === undefined) {
						return;
					}

					return mapRow(row);
				})
				.filter(el => el !== undefined),
		}));
}
