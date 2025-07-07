<script setup lang="ts">
import { ref } from 'vue';

import {
	ModalFilter,
	ModalFilterTabWrapper,
	ModalItemSwitch,
} from '@/modules/widgets/base/modal';
import { UiIcon, IconIds } from '@/shared/ui/icon';

// Реактивные состояния для фильтров
const selectedStock = ref<'industry' | 'sector'>('industry');
const selectedDate = ref<'today' | 'yesterday' | 'week'>('today');
const selectedDisplay = ref<'bar' | 'list'>('bar');
const compactMode = ref(false);

// Методы для обновления состояний
const selectStock = (value: 'industry' | 'sector') => {
	selectedStock.value = value;
};

const selectDate = (value: 'today' | 'yesterday' | 'week') => {
	selectedDate.value = value;
};

const selectDisplay = (value: 'bar' | 'list') => {
	selectedDisplay.value = value;
};
</script>

<template>
	<modal-filter>
		<template #title>
			Filter
		</template>

		<template #content>
			<div :class="classes.content">
				<!-- Stock Section -->
				<div :class="classes.row">
					<div :class="classes.rowTitle">Stock</div>
					<div :class="classes.tabs">
						<modal-filter-tab-wrapper
							:is-active="selectedStock === 'industry'"
							@click="selectStock('industry')"
						>
							Industry
						</modal-filter-tab-wrapper>
						<modal-filter-tab-wrapper
							:is-active="selectedStock === 'sector'"
							@click="selectStock('sector')"
						>
							Sector
						</modal-filter-tab-wrapper>
					</div>
				</div>

				<!-- Date Section -->
				<div :class="classes.row">
					<div :class="classes.rowTitle">Date</div>
					<div :class="classes.tabs">
						<modal-filter-tab-wrapper
							:is-active="selectedDate === 'today'"
							@click="selectDate('today')"
						>
							Today
						</modal-filter-tab-wrapper>
						<modal-filter-tab-wrapper
							:is-active="selectedDate === 'yesterday'"
							@click="selectDate('yesterday')"
						>
							Yesterday
						</modal-filter-tab-wrapper>
						<modal-filter-tab-wrapper
							:is-active="selectedDate === 'week'"
							@click="selectDate('week')"
						>
							<div :class="classes.dateOption">
								A week ago
								<ui-icon :id="IconIds.Calendar" :class="classes.calendarIcon" />
							</div>
						</modal-filter-tab-wrapper>
					</div>
				</div>

				<!-- Display Section -->
				<div :class="classes.row">
					<div :class="classes.rowTitle">Display</div>
					<div :class="classes.tabs">
						<modal-filter-tab-wrapper
							:is-active="selectedDisplay === 'bar'"
							@click="selectDisplay('bar')"
						>
							<div :class="classes.displayOption">
								<ui-icon :id="IconIds.Bars" :class="classes.displayIcon" />
								Bar
							</div>
						</modal-filter-tab-wrapper>
						<modal-filter-tab-wrapper
							:is-active="selectedDisplay === 'list'"
							@click="selectDisplay('list')"
						>
							<div :class="classes.displayOption">
								<ui-icon :id="IconIds.List" :class="classes.displayIcon" />
								List
							</div>
						</modal-filter-tab-wrapper>
					</div>
				</div>

				<!-- Settings Section -->
				<div :class="classes.row">
					<div :class="classes.rowTitle">Settings</div>
					<div :class="classes.settingsContent">
						<modal-item-switch
							v-model="compactMode"
						>
							Compact mode
						</modal-item-switch>
					</div>
				</div>
			</div>
		</template>
	</modal-filter>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 12px 0;
}

.row {
	display: flex;
	align-items: center;
	padding: 4px 12px;
}

.rowTitle {
	flex: 0 0 80px;
	font-weight: 500;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
}

.tabs {
	display: flex;
	flex: 1;
	align-items: center;
	gap: 8px;
}

.settingsContent {
	flex: 1;
}

.dateOption {
	display: flex;
	align-items: center;
	gap: 6px;
}

.displayOption {
	display: flex;
	align-items: center;
	gap: 6px;
}

.calendarIcon {
	width: 12px;
	height: 12px;
	color: var(--icon-color-base-500);
}

.displayIcon {
	width: 12px;
	height: 12px;
	color: var(--icon-color-base-500);
}
</style>
