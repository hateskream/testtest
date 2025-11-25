<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

import ModalItemComponent from './modal-item-component.vue';
</script>

<template>
	<modal-item-component :class="classes.root">
		<slot />

		<ui-icon
			:id="IconIds.RcmArrowRight"
			:class="classes.iconArrowRight"
			width="6"
			height="20"
		/>
	</modal-item-component>
</template>

<style module="classes">
.root {
	cursor: pointer;
}

.iconArrowRight {
	color: #7a7a7a;
}
</style>
