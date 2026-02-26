<script setup lang="ts">
import { computed } from 'vue';

import { calendarCountryData, type ICalendarEvent } from '../../model/calendar';
import { UiIcon, IconIds } from '@/shared/ui/icon';
import { UiImage } from '@/shared/ui/image';

const props = defineProps<{
	meta: ICalendarEvent['meta'];
}>();

const icon = computed(
	() => calendarCountryData.find(v => v.id === props.meta.country)?.icon ?? IconIds.Globus,
);
</script>

<template>
	<div :class="classes.icon">
		<ui-image
			v-if="props.meta.image"
			:src="props.meta.image"
		/>
		<ui-icon
			v-else
			:id="icon"
			width="20px"
			height="20px"
		/>
	</div>
</template>

<style module="classes">
.icon {
	width: 20px;
	min-width: 20px;
	height: 20px;
	overflow: hidden;
	border-radius: 50%;
}

.icon img {
	object-fit: cover;
}
</style>
