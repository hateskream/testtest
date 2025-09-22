<script setup lang="ts">
import { computed } from 'vue';

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
}

const props = defineProps<IProps>();

interface IEmits {
	(e: 'update', data: ITickerSelectAction): void;
}

const emits = defineEmits<IEmits>();

const mappedTickers = computed<ITickerMapped[]>(() => {
	return props.list.map((item) => {
		return getMappedRow(item);
	});
});
</script>

<template>
	<modal-filter-ticker-item
		v-for="item in mappedTickers"
		:key="item.tickerId"
		:is-selected="selectedIdsMap.includes(item.tickerId)"
		:ticker="item.ticker"
		:name="item.name"
		@update="
			emits('update', {
				tickerId: item.tickerId,
				isSelected: !selectedIdsMap.includes(item.tickerId),
			})
		"
	>
		<template #image>
			<div :class="classes.listItemDataImageWrapper">
				<modal-filter-ticker-icon
					:type="item.symbolType"
					:src-image="item.srcImage"
					:ticker="item.ticker"
					:size="12"
				/>
			</div>
		</template>
	</modal-filter-ticker-item>
</template>

<style module="classes">
.listItemDataImageWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
}
</style>
