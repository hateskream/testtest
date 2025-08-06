<script setup lang="ts">
import { computed } from 'vue';

import { UiIcon, IconIds } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import { useAltcoinSeasonStore } from '@/modules/widgets/altcoinSeason/stores';

import AltcoinSeasonTimeFilter from '@/modules/widgets/altcoinSeason/ui/modals/altcoin-season-time-filter.vue';

interface IHistoricalValueHeadingProps {
	showPeriod: boolean;
}

const props = defineProps<IHistoricalValueHeadingProps>();

const altcoinSeasonStore = useAltcoinSeasonStore();

const period = computed(() => altcoinSeasonStore.widgetData.value.widgetConfig?.period);
</script>

<template>
	<div :class="classes.heading">
		<div :class="classes.headingTitle">
			Historical values
		</div>

		<ui-position
			v-if="props.showPeriod"
			ref="historicalValuePositionRef"
			position="bottom-start"
		>
			<template #default="{ isVisible }">
				<div :class="classes.TimeFrameSelector">
					{{ period }}
					<ui-icon
						:id="IconIds.DropdownDown"
						:width="12"
						:height="12"
						:class="[
							classes.icon,
							isVisible ? classes.icon__open : classes.icon__close
						]"
					/>
				</div>
			</template>

			<template #content>
				<altcoin-season-time-filter />
			</template>
		</ui-position>
	</div>
</template>

<style module="classes">
.historicalValueHeading {
	display: flex;
}

.heading {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	align-self: stretch;
}

.icon {
	color: var(--icon-color-base-300);
}

.icon__open {
	transform: rotate(180deg);
	transition: transform 0.3s ease;
}

.icon__close {
	transition: transform 0.3s ease;
}
</style>
