<script setup lang="ts">
import { UiDriver } from '@/shared/ui/driver';
import {
	ModalItem,
	ModalItemCheckbox,
	ModalItemNumber,
	ModalRcm,
	ModalSubmenu,
	ModalSubmenuContent,
} from '../../base';
import { useMarketCapStore } from '../store/market-cap';

const marketCapStore = useMarketCapStore();
</script>

<template>
	<modal-rcm>
		<template #title> Market </template>
		<template #content>
			<modal-item-number :value="1">Duplicate</modal-item-number>
			<modal-item-number :value="2">Open in new tab</modal-item-number>
			<modal-item-number :value="3">Wrap in stack</modal-item-number>

			<modal-item>Turn into new dashboard</modal-item>

			<ui-driver />

			<modal-submenu>
				<template #title> Change display </template>

				<template #content>
					<modal-submenu-content>
						<template #content>
							<modal-item-checkbox
								:model-value="marketCapStore.isShowChart"
								@update:model-value="marketCapStore.toggleShowChart"
							>
								Chart
							</modal-item-checkbox>
							<modal-item-checkbox
								:model-value="marketCapStore.isShowChange"
								@update:model-value="marketCapStore.toggleShowChange"
							>
								Change, %
							</modal-item-checkbox>
						</template>
					</modal-submenu-content>
				</template>
			</modal-submenu>

			<modal-item @click="marketCapStore.resetAll"> Reset all changes </modal-item>

			<ui-driver />

			<modal-item> Delete </modal-item>
		</template>

		<modal-item>Delete</modal-item>
	</modal-rcm>
</template>
