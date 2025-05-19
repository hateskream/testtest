<script setup lang="ts">
import type { IDashboardInstance } from '@/modules/dashboard-group';
import { IconIds, UiIcon } from '@/shared/ui/icon';

import DraggableElement from './draggable-element.vue';
import DashboardComponent from './dashboard-component.vue';
// import DeleteComponent from './delete-component.vue';


interface IDashboardsCurtainComponentProps {
	dashboards: IDashboardInstance[];
}

const props = defineProps<IDashboardsCurtainComponentProps>();

const isCurtainFixed = defineModel<boolean>('isCurtainFixed', { required: true });

const emit = defineEmits<{
	(e: 'drag'): void;
	(e: 'drag-end'): void;
	(e: 'new-dashboard', dashboard: IDashboardInstance): void;
	(e: 'set-can-delete', value: boolean): void;
}>();

function onDrag(dashboard: IDashboardInstance) {
	emit('drag');
	emit('new-dashboard', dashboard);
}

function fixCurtain() {
	isCurtainFixed.value = true;
}

// function unfixCurtain() {
// 	isCurtainFixed.value = false;
// }
</script>

<template>
	<div :class="[classes.root, { [classes.notFixed]: !isCurtainFixed }]">
		<div :class="classes.container">
			<div :class="classes.content">
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
			</div>
			<div v-if="!isCurtainFixed" :class="classes.panel">
				<div
					ref="curtainIconRef"
					:class="classes.iconWrapper"
					@click="fixCurtain"
				>
					<ui-icon
						:id="IconIds.ControlRightMenu"
						width="20px"
						height="20px"
					/>
				</div>

				<div
					ref="addWidgetIconRef"
					:class="classes.iconWrapper"
					@click="fixCurtain"
				>
					<ui-icon
						:id="IconIds.AddWidget"
						width="20px"
						height="20px"
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- <delete-component @set-can-delete="emit('set-can-delete', $event)" />
		<div @click="fixCurtain">
			fix
		</div>
		<div @click="unfixCurtain">
			unfix
		</div> -->
</template>

<style module="classes">
.root {
	width: 358px;
	height: 100%;
}

.notFixed {
	background-color: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}

.container {
	display: flex;
	height: 100%;
}

.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	gap: 10px;
	padding: 18px 12px 0 8px;
}

.panel {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.iconWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 48px;
	height: 48px;
	color: var(--icon-color-base-500);
	cursor: pointer;
}
</style>
