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
			watchlist: [],
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
		const updatedWatchlist = [...section.rows];

		if (
			oldIndex < 0 ||
        newIndex < 0 ||
        oldIndex >= updatedWatchlist.length ||
        newIndex >= updatedWatchlist.length
		) {
			return;
		}

		const [moved] = updatedWatchlist.splice(oldIndex, 1);
		updatedWatchlist.splice(newIndex, 0, moved);

		sections.value = sections.value.map((s, idx) =>
			idx === sectionIdx
				? { ...s, watchlist: updatedWatchlist }
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

		const fromWatchlist = [...fromSection.rows];
		const toWatchlist = [...toSection.rows];

		const rowIdx = fromWatchlist.findIndex(m => m.id === rowId);
		if (rowIdx === -1) {
			return;
		}

		const [moved] = fromWatchlist.splice(rowIdx, 1);
		toWatchlist.splice(toIndex, 0, moved);

		sections.value = sections.value.map((s, idx) => {
			if (idx === fromSectionIdx) {
				return { ...s, watchlist: fromWatchlist };
			}
			if (idx === toSectionIdx) {
				return { ...s, watchlist: toWatchlist };
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
