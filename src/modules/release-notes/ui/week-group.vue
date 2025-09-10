<script setup lang="ts">
import { ref } from 'vue';

import type { IWeekGroup } from '../model';

import NoteItem from './note-item.vue';

interface IWeekGroupProps {
	weekGroup: IWeekGroup;
}

const props = defineProps<IWeekGroupProps>();

const expanded = ref(false);

function toggle() {
	expanded.value = !expanded.value;
}
</script>

<template>
	<div class="week-group">
		<button class="week-header" @click="toggle">
			<div class="week-left">Неделя {{ props.weekGroup.week }}</div>
			<div class="week-right">{{ expanded ? '−' : '+' }}</div>
		</button>

		<transition name="collapse">
			<div v-show="expanded" class="week-body">
				<note-item
					v-for="(note, index) in props.weekGroup.items"
					:key="note.id"
					:note="note"
					:style="{
						marginTop: index === 0 ? '16px' : 0,
					}"
				/>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.week-group {
	margin-bottom: 16px;
}

.week-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 12px 16px;
	color: #ffffff;
	background: rgb(255 255 255 / 2%);
	border: none;
	border-radius: 12px;
	cursor: pointer;
}

.week-body {
	display: flex;
	flex-direction: column;
	margin-top: 0;
	overflow: hidden;
	gap: 12px;
}

.collapse-enter-active,
.collapse-leave-active {
	transition: opacity 220ms ease, transform 220ms ease;
}

.collapse-enter-from,
.collapse-leave-to {
	max-height: 0;
	transform: translateY(-6px);
	opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
	transform: translateY(0);
	opacity: 1;
}
</style>
