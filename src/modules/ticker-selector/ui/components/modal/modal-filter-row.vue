<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import {
	getMappedRow,
	type ITickerMapped,
	type ITickerSelectAction,
	type TickerDto,
} from '@/modules/ticker-selector/model';

import ModalFilterTickerItem from './modal-filter-ticker-item.vue';
import ModalFilterTickerIcon from './modal-filter-ticker-icon.vue';

interface IProps {
	list: TickerDto[];
	selectedIdsMap: string[];
	displayVariant: 'new' | 'default';
	isSearching?: boolean;
}

const props = defineProps<IProps>();

interface IEmits {
	(e: 'update', data: ITickerSelectAction): void;
}

const emit = defineEmits<IEmits>();

const mappedTickers = ref<ITickerMapped[]>([]);

const selectedTickers = computed(() => new Set(props.selectedIdsMap));

function onUpdate(tickerId: string, state: boolean) {
	emit('update', {
		tickerId: tickerId,
		isSelected: state,
	});
}

watch(() => props.list, () => {
	mappedTickers.value = props.list.map(getMappedRow);
}, { deep: true, immediate: true });
</script>

<template>
	<div :class="classes.wrapper">
		<slot name="before-tickers" />
		<modal-filter-ticker-item
			v-for="item in mappedTickers"
			:key="item.tickerId"
			:is-selected="selectedTickers.has(item.tickerId)"
			:ticker="item.ticker"
			:name="item.name"
			:class="classes.listItem"
			@update="onUpdate(item.tickerId, $event)"
		>
			<template #image>
				<div :class="classes.listWrapper">
					<modal-filter-ticker-icon
						:type="item.symbolType"
						:src-image="item.srcImage"
						:ticker="item.ticker"
						:size="30"
						:display-variant="displayVariant"
					/>
				</div>
			</template>
		</modal-filter-ticker-item>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	max-height: 300px;
	overflow: scroll;
	gap: 2px;
}

@supports (-moz-appearance: none) {
	.wrapper:not(:hover) {
		scrollbar-width: none;
	}

	.wrapper {
		scrollbar-width: unset;
	}
}

.wrapper:not(:hover)::-webkit-scrollbar {
	display: none;
}

.wrapper:hover::-webkit-scrollbar {
	width: 6px;
}

.listWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 24px;
}

.listItem {
	flex-shrink: 0;
}
</style>
