<script setup lang="ts">

import { ModalBadge, ModalBadgeList, ModalItemSelector, ModalSubmenuContent } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
// TODO: да-да, мы не экспортируем из других модулей, после исправлю
import type { IMarket, IMarketSettings } from '@/modules/treemap/model';
import { useQueryDisplaySettings } from '@/modules/treemap/query';
import { useDisplaySettings } from '@/modules/treemap/composables';
import { CalendarComponent } from '@/modules/calendar/ui';

const { data: settings } = useQueryDisplaySettings();
const {
	marketSettings: market,
} = useDisplaySettings(settings);

interface ICalendarToolbarProps {
	activeMarket?: IMarket;
}

const props = withDefaults(defineProps<ICalendarToolbarProps>(), {
	activeMarket: () => ({
		displayName: 'Market US',
		id: 'market_us',
	} as IMarket),
});


// const market = defineModel<IMarketSettings>('market', { required: true });

const updateMarket = (newActiveId: string) => {
	market.active = newActiveId;
};
</script>

<template>
	<div :class="classes.calendarToolbar">
		<div :class="classes.toolbarStart">
			<modal-badge
				class="market-modal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					{{ props.activeMarket.displayName }}
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>Market</template>
						<template #default>
							<modal-item-selector
								v-for="m in market.markets"
								:key="m.id"
								:model-value="m.id === market.active"
								@update:model-value="updateMarket(m.id)"
							>
								{{ m.displayName }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge
				class="date-modal"
				strategy="absolute"
			>
				<template #title="{ isVisible }">
					<ui-icon
						:id="IconIds.Calendar"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
					/>
				</template>
				<template #content>
					<modal-submenu-content>
						<template #content>
							<calendar-component />
						</template>

					</modal-submenu-content>
				</template>
			</modal-badge>
		</div>

		<div :class="classes.toolbarEnd">
			<!-- TODO: Add week switcher -->
		</div>
	</div>
</template>

<style module="classes">
.calendarToolbar {
	display: inline-flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
}

.toolbarStart {
	display: flex;
	align-items: center;
	gap: 8px;
}

.toolbarEnd {
	display: flex;
}
</style>
