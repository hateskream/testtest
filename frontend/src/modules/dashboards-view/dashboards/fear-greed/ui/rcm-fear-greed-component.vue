<script setup lang="ts">
import { RcmDashboard, RcmSwitch } from '../../rcm';
import type { IRcmPositions } from '../../rcm/model';
import { useFearGreedStore } from '../stores';

interface IProps {
	positions: IRcmPositions;
}

defineProps<IProps>();

const fearGreedStore = useFearGreedStore();
</script>

<template>
	<rcm-dashboard :positions="positions">
		<template #title> Additional features </template>
		<template #content>
			<rcm-switch
				:model-value="fearGreedStore.isShowChart"
				@update:model-value="fearGreedStore.toggleShowChart"
			>
				Chart
			</rcm-switch>
			<rcm-switch
				:model-value="fearGreedStore.isShowName"
				@update:model-value="fearGreedStore.toggleShowName"
			>
				Name
			</rcm-switch>
			<rcm-switch
				:model-value="fearGreedStore.isShowDescription"
				@update:model-value="fearGreedStore.toggleShowDescription"
			>
				Description
			</rcm-switch>
			<rcm-switch
				:model-value="fearGreedStore.isShowPastValues"
				@update:model-value="fearGreedStore.toggleShowPastValues"
			>
				Past values
			</rcm-switch>
		</template>
	</rcm-dashboard>
</template>
