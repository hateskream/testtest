<script setup lang="ts">
import {
	RcmItem,
	RcmDashboard,
	RcmSubmenu,
	RcmSubmenuContent,
	RcmDriver,
	RcmCheckbox,
	RcmNumber,
} from '../../rcm';
import type { IRcmPositions } from '../../rcm/model';
import { useMarketStore } from '../stores';

import TableColumnsSettingsComponent from './table-columns-settings-component.vue';

interface IProps {
	positions: IRcmPositions;
}

defineProps<IProps>();

const marketStore = useMarketStore();
</script>

<template>
	<rcm-dashboard :positions="positions">
		<template #title> Market </template>
		<template #content>
			<rcm-number :value="1">Duplicate</rcm-number>
			<rcm-number :value="2">Open in new tab</rcm-number>
			<rcm-number :value="3">Wrap in stack</rcm-number>

			<rcm-item>Turn into new dashboard</rcm-item>

			<rcm-driver />

			<rcm-submenu>
				<template #title> Change display </template>

				<template #content>
					<rcm-submenu-content>
						<template #content>
							<rcm-checkbox
								:model-value="marketStore.isFavorites"
								@update:model-value="marketStore.toggleFavorites"
							>
								Only favorites
							</rcm-checkbox>

							<rcm-submenu>
								<template #title> Column metrics </template>
								<template #content>
									<table-columns-settings-component
										class="submenu-content-modal-offset"
									/>
								</template>
							</rcm-submenu>
						</template>
					</rcm-submenu-content>
				</template>
			</rcm-submenu>

			<rcm-item @click="marketStore.resetAll"> Reset all changes </rcm-item>

			<rcm-driver />

			<rcm-item> Delete </rcm-item>
		</template>

		<rcm-item>Delete</rcm-item>
	</rcm-dashboard>
</template>

<style module="classes">
.metrics {
	position: relative;
}

.metricsSettings {
	top: 0;
	left: calc(100% + 10px);
}
</style>
