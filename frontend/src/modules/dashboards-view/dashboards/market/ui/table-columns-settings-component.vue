<script setup lang="ts">
import { computed } from 'vue';

import { useMarketStore } from '../stores';
import { INITIAL_ALL_TABLE_COLUMNS } from '../const';
import type { ITableColumn } from '../model';

import TabWrapper from './tab-wrapper-component.vue';

const marketStore = useMarketStore();

const groupedTableColumns = computed(() => {
	const grouped: { [x: string]: ITableColumn[] } = {};

	INITIAL_ALL_TABLE_COLUMNS.forEach(column => {
		if (!Array.isArray(grouped[column.group.name])) {
			grouped[column.group.name] = [column];
		} else {
			grouped[column.group.name].push(column);
		}
	});

	return grouped;
});

function handleToggleTab(columnName: string) {
	marketStore.toggleShowActiveTableColumns(columnName);
}
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.title">Choose Metrics</div>

		<div>
			<div
				v-for="(columns, key) in groupedTableColumns"
				:key="key"
				:class="classes.row"
			>
				<div :class="classes.rowTitle">
					{{ key }}
				</div>

				<div>
					<div :class="classes.tabs">
						<tab-wrapper
							v-for="tab in columns"
							:key="tab.columnName"
							:is-active="marketStore.showTableColumns.includes(tab.columnName)"
							@click="handleToggleTab(tab.columnName)"
						>
							{{ tab.displayShortColumnName }}
						</tab-wrapper>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.tabs {
	display: flex;
	gap: 8px;
	align-items: center;
}

.row {
	display: flex;
	align-items: center;
	padding: 10px 0;
}

.rowTitle {
	flex: 0 100px;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
}

.rowTitle::first-letter {
	text-transform: uppercase;
}

.title {
	padding: 12px 0;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-100);
}

.container {
	position: absolute;
	left: 0;
	width: max-content;
	min-width: 463px;
	padding: 0 16px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}
</style>
