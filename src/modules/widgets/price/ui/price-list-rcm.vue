<script setup lang="ts">
import { UiDriver } from '@/shared/ui/driver';
import {
	ModalItem,
	ModalItemNumber,
	ModalRcm,
	ModalSubmenu,
} from '@/modules/widgets/base';

import RcmPriceComponent from './rcm-price-component.vue';

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

</script>

<template>
	<modal-rcm>
		<template #title>Performance</template>

		<template #content>
			<modal-item-number :value="1">Duplicate</modal-item-number>
			<modal-item-number :value="2">Open full data</modal-item-number>
			<modal-item-number :value="3">Wrap in stack</modal-item-number>

			<modal-item>Move to</modal-item>

			<ui-driver />

			<modal-submenu>
				<template #title>Change display</template>
				<template #content>
					<rcm-price-component />
				</template>
			</modal-submenu>

			<modal-item @click="null">Reset all changes</modal-item>

			<ui-driver />

			<modal-item @click="emit('delete')">Delete</modal-item>
		</template>
	</modal-rcm>
</template>
