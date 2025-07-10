<script setup lang="ts">
import { UiIcon, IconIds } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';

import AltcoinSeasonTimeFilter from '@/modules/widgets/altcoinSeason/ui/modals/altcoin-season-time-filter.vue';
</script>

<template>
	<div :class="classes.heading">
		<div :class="classes.headingTitle">
			BTC performance rank
		</div>

		<ui-position
			ref="btcPerformancePositionRef"
			position="bottom-start"
		>
			<template #default="{ isVisible }">
				<div :class="classes.TimeFrameSelector">
					90D
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
.btcPerformanceRankHeading {
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
