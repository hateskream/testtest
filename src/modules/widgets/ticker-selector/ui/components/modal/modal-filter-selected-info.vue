<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { ITickerMapped, ITickerSelectAction, TickerDto } from '../../../model';
import { getMappedRow } from '../../../utils';

import ModalFilterTickerIcon from './modal-filter-ticker-icon.vue';

interface IProps {
	list: TickerDto[];
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
	<div
		v-for="item in mappedTickers"
		:key="item.tickerId"
		:class="classes.badge"
	>
		<div :class="classes.badgeImageWrapper">
			<modal-filter-ticker-icon
				:type="item.symbolType"
				:src-image="item.srcImage"
				:ticker="item.ticker"
				:class="classes.badgeImage"
				:size="12"
			/>
		</div>
		<div :class="classes.badgeTitle">
			{{ item.tickerId }}
		</div>
		<ui-icon
			:id="IconIds.Close"
			width="10"
			height="10"
			:class="classes.badgeRemoveIcon"
			@click="emits('update', {
				isSelected: false,
				tickerId: item.tickerId
			})"
		/>
	</div>
</template>

<style module="classes">
.badge {
	display: flex;
	justify-content: center;
	align-items: center;
	width: max-content;
	padding: 6px 10px 6px 8px;
	background: var(--bg-color-base-100-activated);
	border-radius: 28px;
	gap: 8px;
}

.badgeTitle {
	font-style: normal;
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-300-activated);
	letter-spacing: 0.096px;
}

.badgeImage {
	border-radius: 100%;
}

.badgeRemoveIcon {
	color: var(--icon-color-base-300);
}
</style>
