<script setup lang="ts">
import type { ISectionItem } from '@/modules/chart/components';
import { ChartMainColumnSection } from './components';

interface IChartMainColumnProps {
	sections: ISectionItem[];
	activeSection: string | null;
	selectedItem?: string | null;
	registerItemRef: (itemId: string, element: HTMLElement | null) => void;
}

const props = defineProps<IChartMainColumnProps>();
</script>

<template>
	<div class="main-column">
		<chart-main-column-section
			v-for="section in props.sections"
			:key="section.id"
			:section="section"
			:is-active="props.activeSection === section.id"
			:selected-item="props.selectedItem"
			:register-item-ref="props.registerItemRef"
		/>
	</div>
</template>

<style scoped>
.main-column {
	display: flex;
	flex-direction: column;
	gap: 40px;
}
</style>
