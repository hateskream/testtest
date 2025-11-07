<script setup lang="ts">

import { computed } from 'vue';

import type { ITableOpenCell } from '../model';
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IProps {
	data: ITableOpenCell;
}

const props = defineProps<IProps>();

const displayText = computed(() => {
	const { value } = props.data;
	if (typeof value === 'string') {
		return value;
	}

	// If it's a boolean
	if (value) {
		return 'Open';
	}

	return 'Closed';
});

const isShowMoon = computed(()=>{
	return props.data.value === false;
});

</script>

<template>
	<div :class="classes.isOpenContainer">
		<span :class="classes.value" class="paragraph-p-00 color-base">{{ displayText }}
			<ui-icon
				v-if="isShowMoon"

				:id="IconIds.Moon"
				:class="classes.iconWrapper"
				width="16px"
				height="16px"
			/>
		</span>
	</div>
</template>

<style module="classes">
.isOpenContainer {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
	width: 100%;
	height: 22px;
}


.value {
	text-align: left;
	color: var(--text-color-base-500);
}

.iconWrapper {
	margin-left: 4px;
	transform: scaleX(-1) translateY(4px);
}

</style>
