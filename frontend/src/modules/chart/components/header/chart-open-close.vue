<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useIntervalFn } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
import { useChartStore } from '@/modules/chart/store';

import ChartDropdownLayout from '@/modules/chart/components/header/chart-dropdown-layout.vue';

interface ITimeObject {
	hours: number;
	minutes: number;
}
const currentTime = ref(new Date())
const { isActiveMarketOpen, activeExchange } = storeToRefs(useChartStore());

const remainingTimeUntilClose = computed(() => {
	if (!isActiveMarketOpen.value || !activeExchange.value) {
		return { hours: 0, minutes: 0 };
	}

	const now = currentTime.value;
	const closeParts = activeExchange.value.closeTime.split(':');
	const closeTime = new Date(now);
	closeTime.setHours(parseInt(closeParts[0]), parseInt(closeParts[1]), parseInt(closeParts[2]));

	if (closeTime < now) {
		closeTime.setDate(closeTime.getDate() + 1);
	}

	const diffMs = closeTime.getTime() - now.getTime();
	const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
	const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

	return { hours: diffHrs, minutes: diffMins };
});

const remainingTimeUntilOpen = computed(() => {
	if (isActiveMarketOpen.value || !activeExchange.value) {
		return { hours: 0, minutes: 0 };
	}

	const now = currentTime.value;
	const openParts = activeExchange.value.openTime.split(':');
	const openTime = new Date(now);
	openTime.setHours(parseInt(openParts[0]), parseInt(openParts[1]), parseInt(openParts[2]));

	if (openTime < now) {
		openTime.setDate(openTime.getDate() + 1);
	}

	const diffMs = openTime.getTime() - now.getTime();
	const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
	const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

	return { hours: diffHrs, minutes: diffMins };
});

const formatTime = (timeObj: ITimeObject) => {
	const { hours, minutes } = timeObj;

	if (hours === 0 && minutes === 0) {return 'soon';}
	if (hours === 0) {return `${minutes} minute${minutes !== 1 ? 's' : ''}`;}
	if (minutes === 0) {return `${hours} hour${hours !== 1 ? 's' : ''}`;}

	return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

const formattedRemainingTimeUntilClose = computed(() => {
	return formatTime(remainingTimeUntilClose.value);
});

const formattedRemainingTimeUntilOpen = computed(() => {
	return formatTime(remainingTimeUntilOpen.value);
});

useIntervalFn(() => {
	currentTime.value = new Date()
}, 60000);
</script>

<template>
	<ui-position
		position="bottom-start"
		trigger="hover"
	>
		<template #default>
			<div :class="[classes.openCloseLabel, {[classes.closed]: !isActiveMarketOpen}]">
				<div :class="classes.iconWrapper">
					<ui-icon
						v-if="isActiveMarketOpen"
						:id="IconIds.Sun"
						width="26"
						height="26"
					/>
					<ui-icon
						v-else
						:id="IconIds.Moon"
						width="26"
						height="26"
					/>
				</div>
				<div class="paragraph-p01">{{ isActiveMarketOpen ? 'Open' : 'Closed' }}</div>
			</div>
		</template>

		<template #content>
			<chart-dropdown-layout>
				<div :class="classes.dropdown">
					<div
						:class="[classes.dropdownHeader, isActiveMarketOpen ? classes.openMark : classes.closeMark]"
						class="paragraph-p02"
					>
						Market {{ isActiveMarketOpen ? 'opened' : 'closed' }}
					</div>
					<div :class="classes.dropdownContent" class="paragraph-p-00">
						<template v-if="isActiveMarketOpen">
							All's well — market is open. I'll close
							<div :class="classes.dropdownTimeWrapper">
								in
								<span :class="classes.dropdownTime">
									{{ formattedRemainingTimeUntilClose }}
								</span>
							</div>
						</template>
						<template v-else>
							Market is currently closed. It will open
							<div :class="classes.dropdownTimeWrapper">
								in
								<span :class="classes.dropdownTime">
									{{ formattedRemainingTimeUntilOpen }}
								</span>
							</div>
						</template>
					</div>
				</div>
			</chart-dropdown-layout>
		</template>
	</ui-position>
</template>

<style module="classes">
.iconWrapper {
	width: 26px;
	height: 26px;
}

.openCloseLabel {
	display: flex;
	align-items: center;
	padding: 2px 12px 2px 2px;
	color: var(--text-color-base-500);
	background: var(--charts-bg-open);
	border-radius: 999px;
	cursor: pointer;
	user-select: none;
	gap: 3px;
}

.openCloseLabel.closed {
	background: var(--charts-bg-closed);
}

.dropdown {
	display: flex;
	flex-direction: column;
	width: 306px;
	padding: 12px;
	color: var(--text-color-base-500);
	gap: 16px;
}

.dropdownTimeWrapper {
	white-space: nowrap;
}

.dropdownTime {
	font-weight: 700;
}

.dropdownHeader {
	display: flex;
	align-items: center;
	gap: 6px;
}

.openMark::before {
	content: '';
	display: block;
	width: 14px;
	height: 14px;
	margin-bottom: 2px;
	background-color: var(--charts-bg-open);
	border-radius: 999px;
}

.closeMark::before {
	content: '';
	display: block;
	width: 14px;
	height: 14px;
	margin-bottom: 2px;
	background-color: var(--charts-bg-closed);
	border-radius: 999px;
}
</style>
