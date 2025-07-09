<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import draggableComponent from 'vuedraggable';
import { storeToRefs } from 'pinia';

import type { ICurrency } from '../model';
import { usePriceStore } from '../stores';
import type { IMeta } from '@/modules/dashboard-group';

import CellComponent from './cell-component.vue';

interface IViewComponentProps {
	currencies: ICurrency[];
	meta: IMeta;
}


const props = defineProps<IViewComponentProps>();

const layout = ref(props.currencies);

watch(() => props.currencies, (newVal) => {
	layout.value = newVal;
}, {
	deep:true,
});

const { isShowChart, isShowPercentageChange, isShowLogo, isShowTicker, isShowDescription } =
	storeToRefs(usePriceStore());

const gridTemplateContent = computed(() => {
	const defaultMinWidth = props.meta.size.w > 1 ? 190 : 100;

	let minWidth = defaultMinWidth + ((
		(+(isShowChart.value && props.meta.size.w > 1)) +
		+isShowPercentageChange.value +
		(+(isShowLogo.value && props.meta.size.w > 1)) +
		+isShowTicker.value +
		+isShowDescription.value
	) * 30);


	return `repeat(auto-fit, minmax(${minWidth}px, 1fr)) `;
});
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.scrollable">
			<div :class="classes.content">
				<draggable-component
					v-model="layout"
					item-key="ticker"
					:filter="`.price-no-drag`"
					:class="classes.contentWrapped"
					:component-data="{ tag: 'div', name: 'flip-list', type: 'transition-group' }"
					:animation="200"
					:disabled="false"
				>
					<template #item="{ element }">
						<cell-component :currency="element" :meta="meta" />
					</template>
				</draggable-component>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.scrollable {
	position: relative;
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
}

.flip-list-move {
	transition: transform 0.5s;
}

.content {
	width: 100%;
	height: auto;
}

.contentWrapped {
	display: grid;
	grid-template-columns: v-bind(gridTemplateContent);
	width: 100%;
}
</style>

<style scoped>
:deep(.vgl-item--placeholder) {
	background: transparent !important;
}
</style>
