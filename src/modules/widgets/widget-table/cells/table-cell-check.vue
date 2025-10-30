<script setup lang="ts">


import type { ITableCheckCell } from '../model';
import { IconIds, UiIcon } from '@/shared/ui/icon';


interface IProps {
	data: ITableCheckCell;
}

const props = defineProps<IProps>();


</script>

<template>
	<div :class="classes.chartContainer">
		<ui-icon
			v-if="props.data.value"
			:id="IconIds.ControlCheck"
			width="12"
			height="12"
		/>
		<ui-icon
			v-else
			:id="IconIds.ControlClose"
			:class="classes.closeCrest"
			width="12"
			height="12"
		/>

	</div>
</template>

<style module="classes">
.chartContainer {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
	width: 100%;
	height: 32px;
}

.closeCrest {
	color: var(--icon-color-base-300);
}

</style>
