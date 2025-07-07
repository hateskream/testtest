<script setup lang="ts">
import { computed, ref } from 'vue';

import type { IGenericTableColumn } from '../type';
import { useTableColumns } from '../composables/use-table-data.ts';
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IProps {
	allColumns: IGenericTableColumn[];
	visibleColumns: IGenericTableColumn[];
}

interface IEmits {
	(e: 'update:columns', columns: IGenericTableColumn[]): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const isOpen = ref(false);
const { groupColumnsByCategory, toggleColumnVisibility } = useTableColumns();

const groupedColumns = computed(() => {
	return groupColumnsByCategory(props.allColumns);
});

function handleToggleColumn(columnKey: string) {
	const updatedColumns = toggleColumnVisibility(props.allColumns, columnKey);
	emit('update:columns', updatedColumns);
}

function toggleModal() {
	isOpen.value = !isOpen.value;
}
</script>

<template>
	<div :class="classes.columnSettings">
		<ui-icon
			:id="IconIds.Tertiary"
			:class="classes.iconTertiary"
			width="20"
			height="20"
			@click="toggleModal"
		/>

		<div
			v-if="isOpen"
			:class="classes.modal"
			@click.self="toggleModal"
		>
			<div :class="classes.modalContent">
				<div :class="classes.modalHeader">
					<h3>Choose Metrics</h3>
					<button :class="classes.closeButton" @click="toggleModal">
						×
					</button>
				</div>

				<div :class="classes.modalBody">
					<div
						v-for="(columns, groupName) in groupedColumns"
						:key="groupName"
						:class="classes.columnGroup"
					>
						<div :class="classes.groupTitle">
							{{ groupName }}
						</div>

						<div :class="classes.columnTabs">
							<button
								v-for="column in columns"
								:key="column.key"
								:class="[
									classes.columnTab,
									{ [classes.columnTabActive]: column.visible }
								]"
								@click="handleToggleColumn(column.key)"
							>
								{{ column.shortLabel || column.label }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.modal {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2000;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background: rgb(0 0 0 / 50%);
}

.modalContent {
	width: 90%;
	max-width: 600px;
	max-height: 80vh;
	overflow: hidden;
	background: var(--bg-color-surface-01, #1a1a1a);
	border-radius: 12px;
	box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%);
}

.modalHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 24px;
	border-bottom: 1px solid var(--border-color-base-300, #444444);
}

.modalHeader h3 {
	margin: 0;
	font-weight: 600;
	font-size: 18px;
	color: var(--text-color-base-100, #ffffff);
}

.closeButton {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	padding: 0;
	font-size: 24px;
	color: var(--text-color-base-300, #9a9a9d);
	background: none;
	border: none;
	cursor: pointer;
}

.closeButton:hover {
	color: var(--text-color-base-100, #ffffff);
}

.modalBody {
	max-height: 60vh;
	padding: 24px;
	overflow-y: auto;
}

.columnGroup {
	display: flex;
	align-items: center;
	padding: 8px 0;
	gap: 16px;
}

.groupTitle {
	flex: 0 0 100px;
	font-size: 12px;
	color: var(--text-color-base-300, #9a9a9d);
	text-transform: capitalize;
}

.columnTabs {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.columnTab {
	display: flex;
	align-items: center;
	height: 32px;
	padding: 7.5px 12px;
	font-weight: 380;
	font-size: 10px;
	color: var(--text-color-base-300, #9a9a9d);
	background-color: var(--bg-color-base-300, #333333);
	border: none;
	border-radius: 42px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.columnTab:hover {
	background-color: rgb(64 64 64 / 40%);
}

.columnTabActive {
	color: #ffffff;
	background-color: rgb(51 51 51 / 80%);
}

.iconTertiary {
	color: var(--icon-color-base-300);
	cursor: pointer;
	transition: color 0.3s ease-in;
}

.iconTertiary:hover {
	color: var(--icon-color-base-300-effect);
}


</style>
