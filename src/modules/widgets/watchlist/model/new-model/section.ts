import { v4 as uuidv4 } from 'uuid';

import { MarketType } from '@/modules/market';
import type { IRow } from './row';
import { mapRow, type TableRow } from '@/modules/cell';

export enum SpecificSectionType {
	Custom = 'custom',
}

export type SectionType = MarketType | SpecificSectionType;

export interface ISection {
	id: string;
	name: string;
	isOpen: boolean;
	type: SectionType;
	rows: IRow[];
}

const MAX_COUNT_TICKERS = 100;

export function getMockSectionsFirst(): ISection[] {
	return [
		{
			id: '1',
			name: 'Crypto',
			type: MarketType.Crypto,
			isOpen: true,
			rows: [
				{
					id: '1',
				},
				{
					id: '2',
				},
			],
		},
		{
			id: '2',
			name: 'Stocks',
			type: MarketType.Stock,
			isOpen: true,
			rows: [
				{
					id: '3',
				},
			],
		},
		{
			id: '3',
			name: 'Forex',
			type: MarketType.Forex,
			isOpen: true,
			rows: [
				{
					id: '4',
				},
			],
		},
	];
}

export function getMockSectionsSecond(): ISection[] {
	return [
		{
			id: '4',
			name: 'Commodity',
			type: MarketType.Commodities,
			isOpen: true,
			rows: [
				{
					id: '5',
				},
			],
		},
	];
}

export function newCustomSection(): ISection {
	return newSection('Custom', SpecificSectionType.Custom);
}

export function newSection(name: string, type: SectionType): ISection {
	return {
		id: uuidv4(),
		name,
		isOpen: true,
		type,
		rows: [],
	};
}

export function isCustom(section: ISection): boolean {
	return section.type === SpecificSectionType.Custom;
}

export function addTicker(section: ISection, ticker: IRow): ISection {
	if (section.rows.length >= MAX_COUNT_TICKERS) {
		return section;
	}

	return {
		...section,
		rows: [...section.rows, ticker],
	};
}

export function mapSections(sections: ISection[], tickers: TableRow[]) {
	return sections
		.map(({ id, name, isOpen, rows }) => ({
			id,
			title: name,
			isCollapsed: !isOpen,
			rows: rows
				.map(row => {
					const ticker = tickers.find(t => t.tickerId === row.id);
					if (ticker === undefined) {
						return;
					}

					return mapRow(ticker);
				})
				.filter(el => el !== undefined),
		}));
}
