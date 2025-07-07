<script setup lang="ts">
import { ref, nextTick } from 'vue';

import type {
	IGenericTableSection,
	IGenericTableColumn,
	IDragDropEvent,
} from '../type';

import GenericGridRows from './generic-grid-rows.vue';

interface IProps {
	section: IGenericTableSection;
	columns: IGenericTableColumn[];
	gridTemplateColumns: string;
	enableDragDrop?: boolean;
	stickyFirstColumn?: boolean;
	enableRowActions?: boolean;
}

interface IEmits {
	(e: 'sectionToggled', sectionId: string): void;
	(e: 'sectionDeleted', sectionId: string): void;
	(e: 'sectionRenamed', payload: { sectionId: string; newName: string }): void;
	(e: 'rowMoved', payload: IDragDropEvent): void;
	(e: 'rowDeleted', payload: { rowId: string; sectionId: string }): void;
}

const props = withDefaults(defineProps<IProps>(), {
	enableDragDrop: true,
	stickyFirstColumn: true,
	enableRowActions: true,
});

const emit = defineEmits<IEmits>();

const showRenameInput = ref(false);
const renameInputRef = ref<HTMLInputElement>();
const sectionName = ref(props.section.title);

const clickTimeout = ref<number | null>(null);
const CLICK_DELAY = 200;

const handleSectionClick = (sectionId: string) => {
	if (clickTimeout.value || showRenameInput.value) {
		return;
	}

	clickTimeout.value = window.setTimeout(() => {
		emit('sectionToggled', sectionId);
		clickTimeout.value = null;
	}, CLICK_DELAY);
};

const startRename = async (sectionId: string) => {
	console.log(sectionId);
	showRenameInput.value = true;
	sectionName.value = props.section.title;

	await nextTick();
	renameInputRef.value?.focus();
	renameInputRef.value?.select();
};


const handleSectionDoubleClick = (sectionId: string) => {
	if (clickTimeout.value) {
		clearTimeout(clickTimeout.value);
		clickTimeout.value = null;
	}

	startRename(sectionId);
};


const saveRename = (event: Event) => {
	if (event.type !== 'blur') {
		renameInputRef.value?.blur();
		return;
	}

	if (sectionName.value.trim() && sectionName.value.trim() !== props.section.title) {
		emit('sectionRenamed', {
			sectionId: props.section.id,
			newName: sectionName.value.trim(),
		});
	}

	showRenameInput.value = false;
};

const cancelRename = () => {
	sectionName.value = props.section.title;
	showRenameInput.value = false;
};

const handleRowMoved = (payload: IDragDropEvent) => {
	emit('rowMoved', {
		...payload,
		sectionId: props.section.id,
	});
};

const handleRowDeleted = (payload: { rowId: string; sectionId: string }) => {
	emit('rowDeleted', payload);
};

const handleDeleteSection = (sectionId: string) => {
	emit('sectionDeleted', sectionId);
};
</script>

<template>
	<div :class="classes.gridSection">
		<div
			:class="[classes.sectionHeader, { [classes.sectionHeaderOpen]: !section.isCollapsed }]"
			:style="{ gridTemplateColumns }"
			@click="handleSectionClick(section.id)"
			@dblclick="handleSectionDoubleClick(section.id)"
		>
			<div :class="classes.sectionTitle">
				<template v-if="!showRenameInput">
					<span :class="classes.sectionToggle">
						<span
							:class="
								[classes.sectionIcon, section.isCollapsed ?
									classes.sectionIconCollapsed
									: classes.sectionIconExpanded]
							"
						>
							▼
						</span>
					</span>

					<slot
						name="section-header"
						:section="section"
						:is-collapsed="section.isCollapsed"
					>
						<span :class="classes.sectionName">{{ section.title }}</span>
					</slot>
				</template>

				<template v-else>
					<input
						ref="renameInputRef"
						v-model="sectionName"
						type="text"
						:class="classes.renameInput"
						@blur="saveRename"
						@keydown.enter="saveRename"
						@keydown.escape="cancelRename"
					/>
				</template>
			</div>

			<div :class="classes.sectionActions">
				<button
					:class="classes.actionButton"
					title="Delete section"
					@click.stop="handleDeleteSection(section.id)"
				>
					🗑
				</button>
			</div>
		</div>

		<transition
			:enter-active-class="classes.sectionEnterActive"
			:leave-active-class="classes.sectionLeaveActive"
			:enter-from-class="classes.sectionEnterFrom"
			:leave-to-class="classes.sectionLeaveTo"
		>
			<div v-if="!section.isCollapsed" :class="classes.sectionContent">
				<generic-grid-rows
					:rows="section.rows"
					:section-id="section.id"
					:columns="columns"
					:grid-template-columns="gridTemplateColumns"
					:enable-drag-drop="enableDragDrop"
					:sticky-first-column="stickyFirstColumn"
					:enable-row-actions="enableRowActions"
					@row-moved="handleRowMoved"
					@row-deleted="handleRowDeleted"
				>
					<template
						v-for="(_column, _index) in columns"
						:key="_column.key"
						#[`cell-${_index}`]="cellProps"
					>
						<slot
							:name="`cell-${_index}`"
							v-bind="cellProps"
						/>
					</template>
				</generic-grid-rows>
			</div>
		</transition>
	</div>
</template>

<style module="classes">
.gridSection {
	display: flex;
	flex-direction: column;
}

.sectionHeader {
	position: sticky;
	left: 0;
	z-index: 10;
	display: grid;
	align-items: center;
	min-height: 44px;
	padding: 12px 8px;
	font-weight: 440;
	font-size: 14px;
	color: var(--text-color-base-100, #ffffff);
	letter-spacing: 0.096px;
	background: var(--bg-color-surface-02, rgb(255 255 255 / 2%));
	border-bottom: 1px solid var(--border-color-base-300, #444444);
	cursor: pointer;
	transition: color 0.2s ease;
}

.sectionHeader:hover {
	color: rgb(131 132 135 / 90%);
}

.sectionHeader:hover .sectionIcon {
	color: rgb(131 132 135 / 90%);
}

.sectionTitle {
	display: flex;
	flex: 1;
	align-items: center;
	grid-column: 1 / -1;
}

.sectionActions {
	display: flex;
	align-items: center;
	gap: 12px;
	justify-self: end;
	grid-column: -1;
	opacity: 0;
}

.sectionHeaderOpen:hover .sectionActions {
	opacity: 1;
}

.actionButton {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 20px;
	height: 20px;
	color: var(--text-color-base-300, #9a9a9d);
	background: none;
	border: none;
	cursor: pointer;
	transition: color 0.2s ease;
}

.actionButton:hover {
	color: var(--text-color-base-100, #ffffff);
}

.sectionToggle {
	margin-right: 6px;
}

.sectionIcon {
	display: flex;
	width: 12px;
	height: 12px;
	font-size: 8px;
	color: var(--text-color-base-100, #ffffff);
	transition: transform 0.3s ease, color 0.2s ease;
}

.sectionIconCollapsed {
	transform: rotate(-90deg);
}

.sectionIconExpanded {
	transform: rotate(0deg);
}

.sectionName {
	font-weight: inherit;
	font-size: inherit;
	color: inherit;
}

.renameInput {
	font-weight: inherit;
	font-size: inherit;
	color: var(--text-color-base-100, #ffffff);
	letter-spacing: inherit;
	background-color: transparent;
	border: none;
	outline: none;
}

.sectionContent {
	overflow: hidden;
}

.sectionEnterActive,
.sectionLeaveActive {
	max-height: 700px;
	opacity: 1;
	transition: all 0.3s ease;
}

.sectionEnterFrom,
.sectionLeaveTo {
	max-height: 0;
	transform: translateY(-10px);
	opacity: 0;
}
</style>
