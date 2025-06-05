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

	return { addSection, getSections, setSections, sections };
});
