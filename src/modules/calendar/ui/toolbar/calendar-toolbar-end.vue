<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { isSameCalendarDay } from '@/modules/calendar';

const props = defineProps<{
	baseDate: Date;
	initialDate: Date;
}>();

const emits = defineEmits<{
	'prev-week': [];
	'next-week': [];
	'reset-week': [];
}>();
</script>

<template>
	<div :class="classes.toolbarEnd">
		<button
			:class="[classes.nav]"
			@click="emits('prev-week')"
		>
			<ui-icon
				:id="IconIds.DropdownDown"
				width="12"
				height="12"
				:class="['dropdown-icon']"
			/>
		</button>

		<button
			:class="[classes.nav, isSameCalendarDay(props.baseDate, props.initialDate) && classes.hidden]"
			@click="emits('reset-week')"
		>
			<ui-icon
				:id="IconIds.Calendar"
				width="12"
				height="12"
				:class="['dropdown-icon', classes.calendarIcon]"
			/>
			<span :class="classes.redDot" />
		</button>

		<button :class="[classes.nav, classes.rotated]" @click="emits('next-week')">
			<ui-icon
				:id="IconIds.DropdownDown"
				width="12"
				height="12"
				:class="['dropdown-icon']"
			/>
		</button>
		<div v-if="$slots.default" :class="classes.label">
			<slot />
		</div>
	</div>
</template>

<style module="classes">
.toolbarEnd {
	display: flex;
	flex-shrink: 0;
	justify-content: end;
	align-items: center;
	color: #eeeeee;
}

.label {
	margin-left: 12px;
	font-weight: 600;
	font-size: 0.875rem;
}

.nav {
	position: relative;
	display: grid;
	width: 2rem;
	height: 2rem;
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
	right: 8px;
	bottom: 8px;
	width: 6px;
	height: 6px;
	background-color: rgb(230 0 0 / 100%);
	border-radius: 50%;
}

.nav:hover {
	background: #1a1a1a;
}
</style>
