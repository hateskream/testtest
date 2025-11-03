<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { BaseSearch } from '../..';

interface IModalSearchProps {
	placeholder?: string;
}

const props = defineProps<IModalSearchProps>();

const model = defineModel<string>({
	required: true,
});
</script>

<template>
	<div :class="classes.container">
		<ui-icon
			:id="IconIds.Search"
			width="24"
			height="24"
			:class="classes.icon"
		/>

		<base-search
			v-model="model"
			:placeholder="props.placeholder"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
	min-width: 253px;
	height: 48px;
	border-bottom: 1px solid rgb(255 255 255 / 12%);
	gap: 6px;
}

.icon {
	color: var(--icon-color-base-300);
}
</style>
