<script setup lang="ts">
import { computed } from 'vue';
import { GridLayout, GridItem, type LayoutItem } from 'grid-layout-plus';

import type { IGenericTableColumn } from '../type';
import { useTableColumns } from '../composables/use-table-data.ts';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import { UiDriver } from '@/shared/ui/driver';
import { ModalFilter, ModalFilterTabWrapper, ModalFilterTitle } from '@/modules/widgets/base';

interface IProps {
	allColumns: IGenericTableColumn[];
	visibleColumns: IGenericTableColumn[];
}

interface IEmits {
	(e: 'update:columns', columns: IGenericTableColumn[]): void;
}

interface IGridLayoutCell extends LayoutItem {
	data: IGenericTableColumn;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { groupColumnsByCategory, toggleColumnVisibility, updateColumnPositions } = useTableColumns();

const groupedColumns = computed(() => {
	return groupColumnsByCategory(props.allColumns);
});

const draggableColumns = computed(() =>
	props.visibleColumns.filter(column => column.draggable),
);

const layout = computed<IGridLayoutCell[]>(() =>
	draggableColumns.value.map((column, index) => ({
		x: 0,
		y: index,
		w: 12,
		h: 1,
		i: column.key,
		static: false,
		data: column,
	})),
);

const gridConfig = {
	colNum: 12,
	rowHeight: 32,
	margin: [0, 8],
	isDraggable: true,
	isResizable: false,
};

function handleToggleColumn(columnKey: string) {
	const updatedColumns = toggleColumnVisibility(props.allColumns, columnKey);
	emit('update:columns', updatedColumns);
}

function handleUpdatePositions(columnKey: string, _x: number, y: number) {
	const positionMap = new Map();
	layout.value.forEach(item => {
		positionMap.set(item.data.key, item.data.key === columnKey ? y : item.y);
	});

	const updatedColumns = props.allColumns.map(column => {
		if (positionMap.has(column.key)) {
			return {
				...column,
				position: positionMap.get(column.key),
			};
		}
		return column;
	});

	const finalColumns = updateColumnPositions(
		updatedColumns.sort((a, b) =>
			(positionMap.get(a.key) ?? a.position) - (positionMap.get(b.key) ?? b.position),
		),
	);

	emit('update:columns', finalColumns);
}
</script>

<template>
	<div :class="classes.columnSettings">
		<ui-position position="right-start">
			<template #default>
				<ui-icon
					:id="IconIds.Tertiary"
					:class="classes.iconTertiary"
					width="20"
					height="20"
				/>
			</template>

			<template #content>
				<modal-filter>
					<template #title>Choose Metrics</template>

					<template #content>
						<div>
							<div
								v-for="(columns, groupName) in groupedColumns"
								:key="groupName"
								:class="classes.row"
							>
								<div :class="classes.rowTitle">
									{{ groupName }}
								</div>

								<div>
									<div :class="classes.tabs">
										<modal-filter-tab-wrapper
											v-for="column in columns"
											:key="column.key"
											:is-active="column.visible"
											@click="handleToggleColumn(column.key)"
										>
											{{ column.shortLabel || column.label }}
										</modal-filter-tab-wrapper>
									</div>
								</div>
							</div>
						</div>

						<ui-driver :class="classes.driver" />

						<div>
							<modal-filter-title>Column order</modal-filter-title>

							<div>
								<grid-layout
									:layout="layout"
									:col-num="gridConfig.colNum"
									:row-height="gridConfig.rowHeight"
									:margin="gridConfig.margin"
									:is-draggable="gridConfig.isDraggable"
									:is-resizable="gridConfig.isResizable"
									:vertical-compact="true"
									:class="classes.columnCellTabs"
								>
									<grid-item
										v-for="item in layout"
										:key="item.i"
										:x="item.x"
										:y="item.y"
										:w="item.w"
										:h="item.h"
										:i="item.i"
										:static="false"
										:class="classes.columnCellTab"
										@moved="(i, x, y) => handleUpdatePositions(i, x, y)"
									>
										<ui-icon
											:id="IconIds.DoubleDrag"
											:class="classes.icon"
											width="10px"
											height="14px"
										/>
										<modal-filter-tab-wrapper :class="classes.columnCellTabWrapper">
											<span :class="classes.columnCellTabOrder">{{ item.y + 1 }}</span>
											<span>
												{{ item.data.label }}
											</span>
										</modal-filter-tab-wrapper>
									</grid-item>
								</grid-layout>
							</div>
						</div>
					</template>
				</modal-filter>
			</template>
		</ui-position>
	</div>
</template>

<style module="classes">
.columnSettings {
	display: flex;
	align-items: center;
}

.driver {
	margin: 28px 0 12px;
}

.columnCellTabWrapper {
	color: var(--text-color-base-500);
}

.columnCellTabOrder {
	color: var(--text-color-base-300);
}

.columnCellTab {
	display: flex;
	align-items: center;
	gap: 12px;
	cursor: grab;
}

.columnCellTab:active {
	cursor: grabbing;
}

.tabs {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.icon {
	margin-left: 6px;
	color: var(--icon-color-base-300);
}

.row {
	display: flex;
	align-items: center;
	padding: 4px 12px;
}

.rowTitle {
	flex: 0 0 100px;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
	text-transform: capitalize;
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
