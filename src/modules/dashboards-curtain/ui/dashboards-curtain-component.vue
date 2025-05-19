<script setup lang="ts">
import type { IDashboardInstance } from '@/modules/dashboard-group';

import DraggableElement from './draggable-element.vue';
import DashboardComponent from './dashboard-component.vue';
import DeleteComponent from './delete-component.vue';


interface IDashboardsCurtainComponentProps {
	dashboards: IDashboardInstance[];
}

const props = defineProps<IDashboardsCurtainComponentProps>();

const isCurtainFixed = defineModel<boolean>('isCurtainFixed', { required: true });

const emit = defineEmits<{
	(e: 'drag'): void;
	(e: 'drag-end'): void;
	(e: 'new-dashboard', dashboard: IDashboardInstance): void;
	(e: 'is-in', value: boolean): void;
}>();

function onDrag(dashboard: IDashboardInstance) {
	emit('drag');
	emit('new-dashboard', dashboard);
}

function fixCurtain() {
	isCurtainFixed.value = true;
}

function unfixCurtain() {
	isCurtainFixed.value = false;
}
</script>

<template>
	<div :class="classes.root">
		<draggable-element
			v-for="dashboard in props.dashboards"
			:key="dashboard.id"
			@drag="onDrag(dashboard)"
			@drag-end="emit('drag-end')"
		>
			<template #content>
				<dashboard-component :title="dashboard.name" />
			</template>
			<template #ghost>
				<slot name="ghost" :title="dashboard.name" />
			</template>
		</draggable-element>
		<delete-component @is-in="emit('is-in', $event)" />
		<div @click="fixCurtain">
			fix
		</div>
		<div @click="unfixCurtain">
			unfix
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: end;
}
</style>
