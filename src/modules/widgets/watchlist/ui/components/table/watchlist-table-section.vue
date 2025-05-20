<script lang="ts" setup>
import { ref, toValue, watch } from 'vue';

import type {
	ITableRow,
	ITableRowValue,
	ITableRowValueType,
	IWatchlistMarkets,
	IWatchlistSection,
} from '../../../model';
import { useWatchlistStore } from '../../../stores';
import { compareStrings } from '@/shared/lib/compare-strings';
import { UiIcon, IconIds } from '@/shared/ui/icon';

import tableRowsComponent from './table-rows-component.vue';


interface IWatchlistTableProps {
	watchlistSections: IWatchlistSection[];
}

const props = defineProps<IWatchlistTableProps>();

const watchlistStore = useWatchlistStore();

const sectionStates = ref<Record<string, boolean>>({});

const initSectionStates = () => {
	props.watchlistSections.forEach(section => {
		sectionStates.value[section.id] = section.isOpen;
	});
};

initSectionStates();

// change state if got new props
watch(() => props.watchlistSections, () => {
	initSectionStates();
}, { deep: true });

const toggleSection = (sectionId: string) => {
	sectionStates.value[sectionId] = !sectionStates.value[sectionId];
	// TODO: Save state to local storage or elsewere
};

const handleAddSection = () => {
	// TODO: Dropdown menu with available markets to add to the watchlist
	// TODO: sync with backend
	return null;
};

const tableRows = (markets: IWatchlistMarkets[]) => {
	const rows: ITableRow[][] = [];

	markets.forEach(row => {
		if (watchlistStore.isFavorites) {
			if (watchlistStore.favorites.includes(row.id)) {
				rows.push(prepareRow(row));
			}
		} else {
			rows.push(prepareRow(row));
		}
	});

	if (watchlistStore.activeSort.direction !== 0) {
		const activeSortColumn = watchlistStore.activeTableColumns.find(column =>
			compareStrings(toValue(watchlistStore.activeSort.columnName), column.columnName),
		)!;

		rows.sort((a, b) => {
			let leftValue = a[activeSortColumn.position].value;
			let rightValue = b[activeSortColumn.position].value;

			if (watchlistStore.activeSort.direction === -1) {
				leftValue = b[activeSortColumn.position].value;
				rightValue = a[activeSortColumn.position].value;
			}

			return sortRowsByType({
				left: leftValue,
				right: rightValue,
				type: activeSortColumn.type,
			});
		});
	}

	return rows;
};


function prepareRow(row: IWatchlistMarkets) {
	const data: ITableRow[] = [];

	watchlistStore.activeTableColumns.forEach(column => {
		data.push({
			type: column.type,
			srcValue: row.srcValue,
			value: row[column.columnName],
			id: row.id,
		});
	});

	return data;
}

function sortRowsByType(args: {
	left: ITableRowValue;
	right: ITableRowValue;
	type: ITableRowValueType;
}) {
	switch (args.type) {
		case 'date':
			return new Date(args.left).getTime() - new Date(args.right).getTime();

		case 'string':
		case 'image-string':
			return args.left.localeCompare(args.right);

		default:
			return +args.left - +args.right;
	}
}
</script>

<template>
	<!-- Секции рынков -->
	<div>
		<div
			v-for="section in props.watchlistSections"
			:key="section.id"
			:class="classes.marketSection"
		>
			<!-- Заголовок секции -->
			<div :class="classes.sectionHeader" @click="toggleSection(section.id)">
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
			</div>

			<!-- Данные секции -->
			<transition
				:enter-active-class="classes.sectionToggleEnterActive"
				:leave-active-class="classes.sectionToggleLeaveActive"
				:enter-from-class="classes.sectionToggleEnterFrom"
				:leave-to-class="classes.sectionToggleLeaveTo"
			>
				<div v-show="sectionStates[section.id]" :class="classes.sectionData">
					<table-rows-component :rows="tableRows(section.watchlist)" />
				</div>
			</transition>
		</div>

		<div :class="classes.addSectionAction" @click="handleAddSection">
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
	align-items: center;
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
