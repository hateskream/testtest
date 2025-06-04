<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { ISectionItem } from '@/modules/chart/components';

import ChartMainColumnWidget from './chart-main-column-widget.vue';

interface IChartSectionProps {
	section: ISectionItem;
	isActive?: boolean;
	selectedItem?: string | null;
	registerItemRef: (itemId: string, element: HTMLElement | null) => void;
}

const props = defineProps<IChartSectionProps>();

const itemRef = ref<HTMLElement | null>(null);

// Register the ref when component mounts
onMounted(() => {
	if (itemRef.value) {
		props.registerItemRef(props.section.id, itemRef.value);
	}
});
</script>

<template>
	<div
		:data-section-id="props.section.id"
		:class="[classes.sectionContainer, { [classes.activeSection]: props.isActive }]"
	>
		<div ref="itemRef"></div>
		<div :class="classes.sectionTitle">
			<ui-icon
				:id="IconIds.Deals"
				:class="classes.titleIcon"
				width="20px"
				height="20px"
			/>
			<span>{{ props.section.title }}</span>
		</div>

		<div :class="classes.sectionContent">
			<chart-main-column-widget
				v-for="item in props.section.items"
				:key="item.id"
				:item="item"
				:is-selected="props.selectedItem === item.id"
				:register-item-ref="props.registerItemRef"
			/>
		</div>
	</div>
</template>

<style module="classes">
.sectionContainer {
	scroll-margin-top: 20px;
}

.sectionTitle {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	margin-bottom: 22px;
	padding: 12px 16px 12px 0;
	font-size: var(--typography-headers-size-h02);
	gap: 8px;
	background: var(--bg-color-surface-00);
}

.titleIcon {
	color: #ffffff;
}

.sectionContent {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>
