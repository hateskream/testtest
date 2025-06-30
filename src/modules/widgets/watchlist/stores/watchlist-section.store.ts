import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IWatchlistSection } from '../model';


export const useWatchlistSectionStore = defineStore('watchlist-section', () => {

	const sections = ref<IWatchlistSection[]>([]);

	const addSection = (sectionName: string) => {
		sections.value = [...sections.value, {
			id: crypto.randomUUID(),
			name: sectionName,
			isOpen: false,
			rows: [],
		}] as IWatchlistSection[];
	};

	const setSections = (newSections: IWatchlistSection[]) => {
		sections.value = newSections;
	};


	const renameSection = (sectionId: string, newName: string) => {
		const sectionIndex = sections.value.findIndex(section => section.id === sectionId);
		if (sectionIndex !== -1) {
			sections.value = sections.value.map((section, idx) =>
				idx === sectionIndex
					? { ...section, name: newName }
					: section,
			);
		}
	};

	const deleteSection = (sectionId: string) => {
		sections.value = sections.value.filter(section => section.id !== sectionId);
	};

	const moveRowInSection = (sectionId: string, oldIndex: number, newIndex: number) => {
		const sectionIdx = sections.value.findIndex(s => s.id === sectionId);
		if (sectionIdx === -1) {
			return;
		}

		const section = sections.value[sectionIdx];
		const updatedRows = [...section.rows];

		if (
			oldIndex < 0 ||
        newIndex < 0 ||
        oldIndex >= updatedRows.length ||
        newIndex >= updatedRows.length
		) {
			return;
		}

		const [moved] = updatedRows.splice(oldIndex, 1);
		updatedRows.splice(newIndex, 0, moved);

		sections.value = sections.value.map((s, idx) =>
			idx === sectionIdx
				? { ...s, rows: updatedRows }
				: s,
		);
	};

	const moveRowBetweenSections = (
		fromSectionId: string,
		toSectionId: string,
		rowId: string,
		toIndex: number,
	) => {
		const fromSectionIdx = sections.value.findIndex(s => s.id === fromSectionId);
		const toSectionIdx = sections.value.findIndex(s => s.id === toSectionId);
		if (fromSectionIdx === -1 || toSectionIdx === -1) {
			return;
		}

		const fromSection = sections.value[fromSectionIdx];
		const toSection = sections.value[toSectionIdx];

		const fromRows = [...fromSection.rows];
		const toRows = [...toSection.rows];

		const rowIdx = fromRows.findIndex(m => m.tickerID === rowId);
		if (rowIdx === -1) {
			return;
		}

		const [moved] = fromRows.splice(rowIdx, 1);
		toRows.splice(toIndex, 0, moved);

		sections.value = sections.value.map((s, idx) => {
			if (idx === fromSectionIdx) {
				return { ...s, rows: fromRows };
			}
			if (idx === toSectionIdx) {
				return { ...s, rows: toRows };
			}
			return s;
		});
	};

	return {
		addSection,
		setSections,
		sections,
		renameSection,
		deleteSection,
		moveRowInSection,
		moveRowBetweenSections,
	};
});
