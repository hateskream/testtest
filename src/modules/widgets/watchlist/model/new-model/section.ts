import { v4 as uuidv4 } from 'uuid';

import type { MarketType } from '@/modules/market';
import type { IRow } from './row';

enum SpecificSectionType {
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

export function newSection(name: string, type: SectionType): ISection {
	return {
		id: uuidv4(),
		name,
		isOpen: true,
		type,
		rows: [],
	};
}

export function newCustomSection(): ISection {
	return newSection('Custom', SpecificSectionType.Custom);
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
