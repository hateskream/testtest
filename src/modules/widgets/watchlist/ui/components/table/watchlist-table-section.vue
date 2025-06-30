<script lang="ts" setup>
import { nextTick, ref, watch, useTemplateRef } from 'vue';

import {
	type IWatchlistSection,
	type IWatchlistTickerState,
	type ITableColumn,
} from '../../../model';
import { useWatchlistSectionStore } from '../../../stores';
import { UiIcon, IconIds } from '@/shared/ui/icon';

import WatchlistTableRows from './watchlist-table-rows.vue';

interface IWatchlistTableSectionProps {
	watchlistSections: IWatchlistSection[];
	columns: ITableColumn[];
	tickerState: IWatchlistTickerState;
}

const props = defineProps<IWatchlistTableSectionProps>();

const CLICK_DELAY = 200; // ms

const watchlistSectionStore = useWatchlistSectionStore();

const sectionStates = ref<Record<string, boolean>>({});
const renameInputRef = useTemplateRef<HTMLInputElement[]>('renameInputRef');
const addSectionInputRef = useTemplateRef('addSectionInputRef');
const showAddSectionInput = ref(false);
const showRenameInput = ref(false);
const clickTimeout = ref<number | null>(null);
const currentSectionId = ref<string | null>(null);
const sectionName = ref('New section');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dndBuffer = ref<{ added?: any; removed?: any }>({});

const initSectionStates = () => {
	watchlistSectionStore.sections.forEach(section => {
		sectionStates.value[section.id] = section.isOpen;
	});
};

watch(() => watchlistSectionStore.sections, () => {
	initSectionStates();
}, {
	deep: true,
	immediate: true,
});

const toggleSection = (sectionId: string) => {
	sectionStates.value[sectionId] = !sectionStates.value[sectionId];
	// TODO: Save state to local storage or elsewhere
};

const onAddSection = () => {
	showAddSectionInput.value = true;
	nextTick(() => {
		addSectionInputRef.value!.focus();
		addSectionInputRef.value!.select();
	});
};

const saveNewSection = (event: Event) => {
	if (event?.type !== 'blur') {
		addSectionInputRef.value!.blur();
		return;
	}

	watchlistSectionStore.addSection(sectionName.value);

	sectionName.value = 'New section';
	showAddSectionInput.value = false;
};

const onAddTicker = (sectionId: string) => {
	// TODO: Implement logic to add ticker to section
	// eslint-disable-next-line no-console
	console.log('Add ticker to section:', sectionId);

};
const onDeleteSection = (sectionId: string) => {
	watchlistSectionStore.deleteSection(sectionId);

	initSectionStates();
};

const handleRenameSection = async (sectionId: string) => {
	const section = watchlistSectionStore.sections.find(s => s.id === sectionId);
	if (!section) {
		return;
	}

	currentSectionId.value = sectionId;
	showRenameInput.value = true;
	sectionName.value = section.name;

	await nextTick();

	renameInputRef.value?.[0].focus();
	renameInputRef.value?.[0].select();
};

const saveRenamedSection = (event: Event) => {
	if (event?.type !== 'blur') {
		renameInputRef.value?.[0].blur();
		return;
	}

	if (!currentSectionId.value || !sectionName.value.trim()) {
		return;
	}

	watchlistSectionStore.renameSection(currentSectionId.value, sectionName.value);

	sectionName.value = 'New section';
	showRenameInput.value = false;
	currentSectionId.value = null;
};

function onSectionClick(sectionId: string) {
	if (clickTimeout.value) {
		return;
	}

	if (showRenameInput.value) {
		return;
	}

	clickTimeout.value = window.setTimeout(() => {
		toggleSection(sectionId);
		clickTimeout.value = null;
	}, CLICK_DELAY);
}


function onSectionDblClick(sectionId: string) {
	if (clickTimeout.value) {
		clearTimeout(clickTimeout.value);
		clickTimeout.value = null;
	}

	handleRenameSection(sectionId);
}

// Removed old tableRows, prepareRow, and sortRowsByType functions
// as they are no longer needed with the new typed cell architecture

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onRowDnd(evt: any) {
	if (evt.type === 'added') {
		dndBuffer.value.added = evt;
	}
	if (evt.type === 'removed') {
		dndBuffer.value.removed = evt;
	}

	// Если оба события пришли — делаем перенос
	if (dndBuffer.value.added && dndBuffer.value.removed) {
		const removedElement = dndBuffer.value.removed.element;
		const tickerID = Array.isArray(removedElement)
			? removedElement[0]?.tickerID
			: removedElement?.tickerID;

		if (!tickerID) {
			console.error('No tickerID found in removed element:', removedElement);
			dndBuffer.value = {};
			return;
		}

		watchlistSectionStore.moveRowBetweenSections(
			dndBuffer.value.removed.sectionId, // id секции-источника
			dndBuffer.value.added.sectionId, // id секции-приёмника
			tickerID, // id строки (market)
			dndBuffer.value.added.newIndex, // индекс, куда вставить
		);
		dndBuffer.value = {};
	}
}
</script>

<template>
	<!-- Секции рынков -->
	<div :class="classes.watchlistTableSection">
		<div
			v-for="section in watchlistSectionStore.sections"
			:key="section.id"
			:class="classes.marketSection"
		>
			<!-- Заголовок секции -->
			<div
				:class="[
					classes.sectionHeader,
					sectionStates[section.id] ? classes.sectionHeader__open : ''
				]"
				@click="onSectionClick(section.id)"
				@dblclick="onSectionDblClick(section.id)"
			>
				<div :class="classes.sectionStart">
					<template v-if="!showRenameInput || currentSectionId !== section.id">
						<span :class="classes.sectionToggle">
							<ui-icon
								:id="IconIds.DropdownDown"
								:class="[
									classes.sectionIcon,
									sectionStates[section.id] ? classes.sectionIcon__open : classes.sectionIcon__close
								]"
							/>
						</span>
						<span :class="classes.sectionName">{{ section.name }}</span>
					</template>

					<template v-else-if="showRenameInput && currentSectionId === section.id">
						<input
							ref="renameInputRef"
							v-model="sectionName"
							type="text"
							:class="classes.renameSectionInput"
							@blur="saveRenamedSection"
							@keydown.enter="saveRenamedSection"
						>
					</template>
				</div>

				<div :class="classes.sectionEnd">
					<ui-icon
						:id="IconIds.Plus"
						:width="20"
						:height="20"
						:class="classes.sectionHoverIcon"
						@click.stop="onAddTicker(section.id)"
					/>

					<ui-icon
						:id="IconIds.TrashOutline"
						:width="20"
						:height="20"
						:class="classes.sectionHoverIcon"
						@click.stop="onDeleteSection(section.id)"
					/>
				</div>
			</div>

			<!-- Данные секции -->
			<transition
				:enter-active-class="classes.sectionToggleEnterActive"
				:leave-active-class="classes.sectionToggleLeaveActive"
				:enter-from-class="classes.sectionToggleEnterFrom"
				:leave-to-class="classes.sectionToggleLeaveTo"
			>
				<div v-if="sectionStates[section.id]" :class="classes.sectionData">
					<watchlist-table-rows
						:rows="section.rows"
						:columns="props.columns"
						:section-id="section.id"
						:ticker-state="props.tickerState"
						@row-dnd="onRowDnd"
					/>
				</div>
			</transition>
		</div>

		<div v-if="showAddSectionInput" :class="classes.addSectionWrapper">
			<input
				ref="addSectionInputRef"
				v-model="sectionName"
				type="text"
				@blur="saveNewSection"
				@keydown.enter="saveNewSection"
			>
		</div>

		<div :class="classes.addSectionAction" @click="onAddSection">
			<ui-icon
				:id="IconIds.ControlPlus"
				:class="classes.actionIcon"
			/>
			<span :class="classes.sectionName">Add section</span>
		</div>
	</div>
</template>

<style module="classes">
.marketSection {
	position: relative;
}

.sectionHeader {
	position: sticky;
	left: 0;
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 44px;
	padding: 12px 8px;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-01);
	color: var(--text-color-base-100);
	letter-spacing: 0.096px;
	cursor: pointer;

	&:hover {
		color: rgb(131 132 135 / 90%);

		.sectionIcon {
			color: rgb(131 132 135 / 90%);
		}
	}
}

.sectionStart {
	display: inline-flex;
	align-items: center;
}

.sectionEnd {
	display: none;
}

.sectionHeader__open {
	&:hover {
		.sectionEnd {
			display: inline-flex;
			align-items: center;
			gap: 12px;
		}
	}
}

.sectionHoverIcon {
	color: var(--text-color-base-300);
}


.sectionToggle {
	margin-right: 6px;

	.sectionIcon {
		display: flex;
		width: 12px;
		height: 12px;
		color: var(--text-color-base-100);
		fill: var(--text-color-base-100);
	}

	.sectionIcon__close {
		transform: rotate(-90deg);
		transition: transform 0.3s ease;
	}

	.sectionIcon__open {
		transform: rotate(0deg);
		transition: transform 0.3s ease;
	}
}

.addSectionAction {
	display: inline-flex;
	align-items: center;
	padding: 12px 8px;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-01);
	color: var(--text-color-base-100);
	letter-spacing: 0.096px;
	cursor: pointer;

	.actionIcon {
		display: flex;
		width: 12px;
		height: 12px;
		margin-right: 6px;
		color: var(--text-color-base-100);
	}

	&:hover {
		color: rgb(131 132 135 / 90%);

		.actionIcon {
			color: rgb(131 132 135 / 90%);
		}
	}
}

.watchlistTableSection {
	display: flex;
	flex-direction: column;
}

.renameSectionInput {
	text-align: start;
	background-color: transparent;
}

.addSectionWrapper {
	display: inline-flex;
	align-items: center;
	padding: 12px 8px;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-01);
	color: var(--text-color-base-100);
	letter-spacing: 0.096px;
	cursor: pointer;

	input {
		text-align: start;
		background-color: transparent;
	}
}

/* section toggle animation */
.sectionToggleEnterActive,
.sectionToggleLeaveActive {
	max-height: 700px;
	opacity: 1;
	transition: all 0.3s ease;
}

.sectionToggleEnterFrom,
.sectionToggleLeaveTo {
	max-height: 0;
	transform: translateY(-10px);
	opacity: 0;
}
</style>
