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

	const getSections = ():IWatchlistSection[] => {
		return sections.value;
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

	return { addSection, getSections, setSections, sections, renameSection };
});
