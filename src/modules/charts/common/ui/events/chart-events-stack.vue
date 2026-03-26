<script setup lang="ts">
import { ModalBadgeList } from '@/modules/widgets/base';

interface IProps {
	multiple?: boolean;
	title?: string;
	displayVariant: 'new' | 'default';
}

const props = defineProps<IProps>();
</script>

<template>
	<modal-badge-list v-if="props.multiple" :display-variant="props.displayVariant">
		<template #title>
			<slot name="title">{{ props.title }}</slot>
		</template>
		<template #default>
			<div :class="classes.scrollable">
				<slot />
			</div>
		</template>
	</modal-badge-list>
	<slot v-else />
</template>

<style module="classes">
.scrollable {
	display: flex;
	flex-direction: column;
	min-height: 0;
	max-height: 400px;
	padding-right: 5px;
	overflow-y: auto;
	gap: 10px;
}
</style>
