<script setup lang="ts">
import { BaseDashboardComponent } from '@/modules/widgets/base/';
import type { IMeta } from '@/modules/dashboard-group/core';

import TopIndicesMain from './layouts/main-layout.vue';
import TopIndicesContextMenu from './modals/context-menu.vue';


interface ITopIndicesWidgetProps {
	meta: IMeta;
}

const props = defineProps<ITopIndicesWidgetProps>();


const emit = defineEmits<{
	(e: 'delete'): void;
}>();
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<!-- <top-indices-loader
				v-if="false"
				:count="5"
				:height="'48px'"
			/> -->
			<!-- <top-indices-error v-else-if="false" /> -->

			<top-indices-main
				:meta="props.meta"
			/>
		</template>

		<template #rcm>
			<top-indices-context-menu :title="props.meta.name" @delete="emit('delete')" />
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.topIndicesWidget {
	display: flex;
}
</style>
