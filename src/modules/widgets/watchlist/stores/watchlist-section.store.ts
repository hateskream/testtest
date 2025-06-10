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

	return { addSection, setSections, sections, renameSection, deleteSection };
});
