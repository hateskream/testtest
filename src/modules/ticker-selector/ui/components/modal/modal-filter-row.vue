<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';

import {
	getMappedRow,
	type ITickerMapped,
	type ITickerSelectAction,
	type TickerDto,
} from '@/modules/ticker-selector/model';

import ModalFilterTickerItem from './modal-filter-ticker-item.vue';
import ModalFilterTickerIcon from './modal-filter-ticker-icon.vue';
import ModalFilterScrollable from './modal-filter-scrollable.vue';

interface IProps {
	list: TickerDto[];
	selectedIdsMap: string[];
	displayVariant: 'new' | 'default';
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

onBeforeMount(() => {
	mappedTickers.value = props.list.map(getMappedRow);
});
</script>

<template>
	<modal-filter-scrollable>
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
						:size="22"
						:display-variant="displayVariant"
					/>
				</div>
			</template>
		</modal-filter-ticker-item>
	</modal-filter-scrollable>
</template>

<style module="classes">
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
