<script setup lang="ts">
import { ModalItemSwitch, ModalRcm } from '../../base';
import { useFearGreedStore } from '../stores';

const fearGreedStore = useFearGreedStore();
</script>

<template>
	<modal-rcm>
		<template #title> Additional features </template>
		<template #content>
			<modal-item-switch
				:model-value="fearGreedStore.isShowChart"
				@update:model-value="fearGreedStore.toggleShowChart"
			>
				Chart
			</modal-item-switch>
			<modal-item-switch
				:model-value="fearGreedStore.isShowName"
				@update:model-value="fearGreedStore.toggleShowName"
			>
				Name
			</modal-item-switch>
			<modal-item-switch
				:model-value="fearGreedStore.isShowDescription"
				@update:model-value="fearGreedStore.toggleShowDescription"
			>
				Description
			</modal-item-switch>
			<modal-item-switch
				:model-value="fearGreedStore.isShowPastValues"
				@update:model-value="fearGreedStore.toggleShowPastValues"
			>
				Past values
			</modal-item-switch>
		</template>
	</modal-rcm>
</template>
