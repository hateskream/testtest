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
	displayVariant: 'new' | 'default';
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
	<div :class="classes.bottom">
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
						:display-variant="displayVariant"
					/>
				</div>
			</template>
		</modal-filter-ticker-item>
	</div>
</template>

<style module="classes">
.bottom {
	max-height: 450px;
	margin: 0 -6px;
	padding: 6px;
	overflow-y: scroll;
}

@supports (-moz-appearance: none) {
	.bottom:not(:hover) {
		scrollbar-width: none;
	}

	.container {
		scrollbar-width: unset;
	}
}

.bottom:not(:hover)::-webkit-scrollbar {
	display: none;
}

.bottom:hover::-webkit-scrollbar {
	width: 6px;
}

.listItemDataImageWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 24px;
}
</style>
