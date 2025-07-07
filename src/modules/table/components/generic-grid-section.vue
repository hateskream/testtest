<script setup lang="ts">
import { ref, nextTick } from 'vue';

import type {
	IGenericTableSection,
	IGenericTableColumn,
	IDragDropEvent,
} from '../type';

import GenericGridRows from './generic-grid-rows.vue';

interface IProps<T = Record<string, unknown>> {
	section: IGenericTableSection<T>;
	columns: IGenericTableColumn[];
	gridTemplateColumns: string;
	enableDragDrop?: boolean;
	stickyFirstColumn?: boolean;
	enableRowActions?: boolean;
}

interface IEmits<T = Record<string, unknown>> {
	(e: 'sectionToggled', sectionId: string): void;
	(e: 'sectionDeleted', sectionId: string): void;
	(e: 'sectionRenamed', payload: { sectionId: string; newName: string }): void;
	(e: 'rowMoved', payload: IDragDropEvent<T>): void;
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
	<div class="grid-section">
		<div
			class="section-header"
			:class="{ 'section-header-open': !section.isCollapsed }"
			:style="{ gridTemplateColumns }"
			@click="handleSectionClick(section.id)"
			@dblclick="handleSectionDoubleClick(section.id)"
		>
			<div class="section-title">
				<template v-if="!showRenameInput">
					<span class="section-toggle">
						<span
							class="section-icon"
							:class="section.isCollapsed ? 'section-icon-collapsed' : 'section-icon-expanded'"
						>
							▼
						</span>
					</span>

					<slot
						name="section-header"
						:section="section"
						:is-collapsed="section.isCollapsed"
					>
						<span class="section-name">{{ section.title }}</span>
					</slot>
				</template>

				<template v-else>
					<input
						ref="renameInputRef"
						v-model="sectionName"
						type="text"
						class="rename-input"
						@blur="saveRename"
						@keydown.enter="saveRename"
						@keydown.escape="cancelRename"
					/>
				</template>
			</div>

			<div class="section-actions">
				<button
					class="action-button"
					title="Delete section"
					@click.stop="handleDeleteSection(section.id)"
				>
					🗑
				</button>
			</div>
		</div>

		<transition
			enter-active-class="section-enter-active"
			leave-active-class="section-leave-active"
			enter-from-class="section-enter-from"
			leave-to-class="section-leave-to"
		>
			<div v-if="!section.isCollapsed" class="section-content">
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
						v-for="(column, index) in columns"
						:key="column.key"
						#[`cell-${index}`]="cellProps"
					>
						<slot
							:name="`cell-${index}`"
							v-bind="cellProps"
						/>
					</template>
				</generic-grid-rows>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.grid-section {
	display: flex;
	flex-direction: column;
}

.section-header {
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

.section-header:hover {
	color: rgb(131 132 135 / 90%);
}

.section-header:hover .section-icon {
	color: rgb(131 132 135 / 90%);
}

.section-title {
	display: flex;
	flex: 1;
	align-items: center;
	grid-column: 1 / -1;
}

.section-actions {
	display: flex;
	align-items: center;
	gap: 12px;
	justify-self: end;
	grid-column: -1;
	opacity: 0;
}

.section-header-open:hover .section-actions {
	opacity: 1;
}

.action-button {
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

.action-button:hover {
	color: var(--text-color-base-100, #ffffff);
}

.section-toggle {
	margin-right: 6px;
}

.section-icon {
	display: flex;
	width: 12px;
	height: 12px;
	font-size: 8px;
	color: var(--text-color-base-100, #ffffff);
	transition: transform 0.3s ease, color 0.2s ease;
}

.section-icon-collapsed {
	transform: rotate(-90deg);
}

.section-icon-expanded {
	transform: rotate(0deg);
}

.section-name {
	font-weight: inherit;
	font-size: inherit;
	color: inherit;
}

.rename-input {
	font-weight: inherit;
	font-size: inherit;
	color: var(--text-color-base-100, #ffffff);
	letter-spacing: inherit;
	background-color: transparent;
	border: none;
	outline: none;
}

.section-content {
	overflow: hidden;
}

.section-enter-active,
.section-leave-active {
	max-height: 700px;
	opacity: 1;
	transition: all 0.3s ease;
}

.section-enter-from,
.section-leave-to {
	max-height: 0;
	transform: translateY(-10px);
	opacity: 0;
}
</style>
