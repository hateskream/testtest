import { v4 as uuidv4 } from 'uuid';

import { MarketType } from '@/modules/market';
import { updateById } from '@/shared/lib';

export enum SpecificSectionType {
	Custom = 'custom',
}

export type SectionType = MarketType | SpecificSectionType;

export interface ISection {
	id: string;
	name: string;
	type: SectionType;
	tickerIds: string[];
}

const MAX_COUNT_TICKERS = 100;

const MAX_COUNT_CUSTOM_SECTIONS = 5;

function newSectionByType(type: SectionType): ISection {
	const newSection = (name: string) => ({
		id: uuidv4(),
		name,
		type,
		tickerIds: [],
	});

	switch (type) {
		case MarketType.Crypto:
			return newSection('Crypto');
		case MarketType.Stock:
			return newSection('Stocks');
		case MarketType.Forex:
			return newSection('Forex');
		case MarketType.Commodities:
			return newSection('Commodity');
		case MarketType.Indices:
			return newSection('Indices');
		case SpecificSectionType.Custom:
			return newSection('Custom');
	}
}

export function addCustomSection(sections: ISection[]): ISection[] {
	if (
		sections.length >= MAX_COUNT_CUSTOM_SECTIONS
	) {
		return sections;
	}

	return [
		...sections,
		newSectionByType(SpecificSectionType.Custom),
	];
}

export function renameSection(sections: ISection[], sectionId: string, newName: string): ISection[] {
	return updateById(sections, sectionId, section => ({
		...section,
		name: newName,
	}));
}

export function deleteSection(sections: ISection[], sectionId: string): ISection[] {
	return sections.filter(section => section.id !== sectionId);
}

export function addTicker(
	sections: ISection[],
	tickerId: string,
	market: MarketType,
): ISection[] {
	return sections
		.find(section => section.type === market)
		? sections
			.map(section =>
				section.type === market
					? addTickerInSection(
						section,
						tickerId,
					)
					: section,
			)
		: [
			...sections,
			addTickerInSection(
				newSectionByType(market),
				tickerId,
			),
		];
}

function addTickerInSection(section: ISection, tickerId: string): ISection {
	if (section.tickerIds.length >= MAX_COUNT_TICKERS) {
		return section;
	}

	return {
		...section,
		tickerIds: [...section.tickerIds, tickerId],
	};
}

export function deleteTicker(sections: ISection[], tickerId: string): ISection[] {
	return sections
		.map(section => ({
			...section,
			tickerIds: section.tickerIds.filter(id => id !== tickerId),
		}))
		.filter(section => section.tickerIds.length > 0);
}

export function moveRowInSection(
	sections: ISection[],
	sectionId: string,
	oldIndex: number,
	newIndex: number,
): ISection[] {
	const sectionIndex = sections.findIndex(sec => sec.id === sectionId);
	if (sectionIndex === -1) {
		return sections;
	}

	const section = sections[sectionIndex];
	const updatedRows = [...section.tickerIds];

	if (
		oldIndex < 0 ||
		newIndex < 0 ||
		oldIndex >= updatedRows.length ||
		newIndex >= updatedRows.length
	) {
		return sections;
	}

	const [moved] = updatedRows.splice(oldIndex, 1);
	updatedRows.splice(newIndex, 0, moved);

	return updateById(
		sections,
		sectionId,
		sec => ({
			...sec,
			rows: updatedRows,
		}),
	);
};

export function moveRowBetweenSections(
	sections: ISection[],
	fromSectionId: string,
	toSectionId: string,
	rowId: string,
	toIndex: number,
): ISection[] {
	const fromSectionIdx = sections.findIndex(sec => sec.id === fromSectionId);
	const toSectionIdx = sections.findIndex(sec => sec.id === toSectionId);
	if (fromSectionIdx === -1 || toSectionIdx === -1) {
		return sections;
	}

	const fromSection = sections[fromSectionIdx];
	const toSection = sections[toSectionIdx];

	const fromTickerIds = [...fromSection.tickerIds];
	const toTickerIds = [...toSection.tickerIds];

	const rowIdx = fromTickerIds.findIndex(m => m === rowId);
	if (rowIdx === -1) {
		return sections;
	}

	const [moved] = fromTickerIds.splice(rowIdx, 1);
	toTickerIds.splice(toIndex, 0, moved);

	return sections.map((s, idx) => {
		if (idx === fromSectionIdx) {
			return { ...s, tickerIds: fromTickerIds };
		}
		if (idx === toSectionIdx) {
			return { ...s, tickerIds: toTickerIds };
		}
		return s;
	});
};
