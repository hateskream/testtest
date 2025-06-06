<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

import type { IWidgetItem } from '@/modules/chart/components/widgets/explorer';

interface IChartItemWidgetProps {
	item: IWidgetItem;
	isSelected?: boolean;
	registerItemRef: (itemId: string, element: HTMLElement | null) => void;
}

const props = defineProps<IChartItemWidgetProps>();

const itemRef = ref<HTMLElement | null>(null);

onMounted(() => {
	if (itemRef.value) {
		props.registerItemRef(props.item.id, itemRef.value);
	}
});

onUnmounted(() => {
	props.registerItemRef(props.item.id, null);
});
</script>

<template>
	<div
		:class="[
			classes.itemContainer,
			{ [classes.selectedItem]: props.isSelected }
		]"
	>
		<div :class="classes.itemTitle">
			<div ref="itemRef" :class="classes.itemTitleAnchor" />
			{{ props.item.title }}
		</div>
		<div :class="classes.placeholderBlock">
		</div>
	</div>
</template>

<style module="classes">
.itemContainer {
	display: flex;
	flex-direction: column;
	gap: 12px;
	scroll-margin-top: 20px;
}


.itemTitle {
	position: relative;
	margin-bottom: 8px;
	font-weight: 500;
	font-size: 14px;
	color: var(--text-color-base-300);
}

.itemTitleAnchor {
	position: absolute;
	top: -55px;
	width: 0;
	height: 0;
}

.placeholderBlock {
	min-height: 300px;
	background: rgb(84 84 95 / 60%);
	border-radius: 4px;
}
</style>
