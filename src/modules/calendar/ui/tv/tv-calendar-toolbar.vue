<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue';

import type { CalendarCategory, CalendarCountryIds, CalendarImpact } from '../../model/calendar';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { UiIcon, IconIds } from '@/shared/ui/icon';
import { ModalBadge, ModalBadgeList, ModalSubmenu, ModalSubmenuContent } from '@/modules/widgets/base';

import CalendarCountryBadgeModal from '../calendar-country-badge-modal.vue';
import CalendarCategoriesBadgeModal from '../calendar-categories-badge-modal.vue';
import CalendarImpactBadgeModal from '../calendar-impact-badge-modal.vue';
import CalendarRangeBadgeModal from '../calendar-range-badge-modal.vue';
import CalendarCategoriesList from '../common/calendar-categories-list.vue';
import CalendarImpactList from '../common/calendar-impact-list.vue';
import CalendarRangePicker from '../common/calendar-range-picker.vue';

const country = defineModel<CalendarCountryIds[]>('countries', {
	required: true,
});
const categories = defineModel<CalendarCategory[]>('categories', {
	required: true,
});
const impact = defineModel<CalendarImpact[]>('impact', {
	required: true,
});
const range = defineModel<{ from: number; to: number }>('range', {
	required: true,
});

const toolbarRef = useTemplateRef('toolbar');

const isMinified = ref(false);

let observer: ResizeObserver | null = null;

onMounted(() => {
	const el = toolbarRef.value;

	if (!el) {
		return;
	}

	observer = new ResizeObserver((entries) => {
		var { width } = entries[0].contentRect;
		isMinified.value = width <= 507;
	});

	observer.observe(el);
});

onBeforeUnmount(() => {
	if (observer) {
		observer.disconnect();
		observer = null;
	}
});
</script>

<template>
	<div ref="toolbar" :class="classes.toolbar">
		<div :class="classes.start">
			<calendar-country-badge-modal
				v-model="country"
				display-variant="default"
			/>

			<ui-delimiter />

			<template v-if="isMinified">
				<modal-badge display-variant="default">
					<template #title>
						<ui-icon
							:id="IconIds.Burger"
							width="16px"
							height="16px"
						/>
					</template>
					<template #content>
						<modal-badge-list display-variant="default">
							<template #title>
								Filters
							</template>

							<template #default>
								<modal-submenu placement="right-start" :offset="12">
									<template #title>Event Type</template>
									<template #content>
										<modal-submenu-content>
											<template #content>
												<calendar-categories-list v-model="categories" />
											</template>
										</modal-submenu-content>
									</template>
								</modal-submenu>

								<modal-submenu placement="right-start" :offset="12">
									<template #title>Impact</template>
									<template #content>
										<modal-submenu-content>
											<template #content>
												<calendar-impact-list v-model="impact" />
											</template>
										</modal-submenu-content>
									</template>
								</modal-submenu>

								<modal-submenu placement="right-start" :offset="12">
									<template #title>Date Range</template>
									<template #content>
										<modal-submenu-content>
											<template #content>
												<calendar-range-picker v-model="range" />
											</template>
										</modal-submenu-content>
									</template>
								</modal-submenu>
							</template>
						</modal-badge-list>
					</template>
				</modal-badge>
			</template>

			<template v-else>
				<calendar-categories-badge-modal v-model="categories" display-variant="default" />
				<calendar-impact-badge-modal v-model="impact" display-variant="default" />
				<calendar-range-badge-modal v-model="range" display-variant="default" />
			</template>
		</div>
	</div>
</template>

<style module="classes">
.toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	width: 100%;
	container-type: inline-size;
	container-name: toolbar;
}

.start {
	display: flex;
	align-items: center;
	gap: 8px;
}

.end {
	display: flex;
	flex-shrink: 0;
	justify-content: end;
	align-items: center;
	color: #eeeeee;
}

.controls {
	display: flex;
	gap: 2px;
}

.nav {
	position: relative;
	display: grid;
	width: 20px;
	height: 20px;
	padding: 0;
	line-height: 0;
	color: inherit;
	background: transparent;
	border: none;
	border-radius: 0.5rem;
	cursor: pointer;
	place-items: center;

	&:first-child {
		transform: rotate(90deg);
	}
}

.hidden {
	visibility: hidden;
}

.rotated {
	transform: rotate(-90deg);
}

.redDot {
	position: absolute;
	right: 0;
	bottom: 0;
	width: 6px;
	height: 6px;
	background-color: rgb(230 0 0 / 100%);
	border-radius: 50%;
}
</style>
