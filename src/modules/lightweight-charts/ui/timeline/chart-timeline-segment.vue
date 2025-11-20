<script setup lang="ts">

import type { CSSProperties } from 'vue';

import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeList } from '@/modules/widgets/base';

interface IProps {
	color?: string;
	width: CSSProperties['width'];
	title?: string;
}

const props = withDefaults(defineProps<IProps>(), {
	color: 'var(--bg-100, rgb(73 73 80 / 32%))',
	title: '',
});
</script>

<template>
	<ui-position
		v-if="props.title.length"
		placement="bottom-start"
		trigger="hover"
		:style="{ width: props.width }"
	>
		<template #title>
			<div :class="[classes.segment, classes.inner]"></div>
		</template>
		<template #content>
			<modal-badge-list>
				<template #default>
					<div :class="classes.title">{{ props.title }}</div>
				</template>
			</modal-badge-list>
		</template>
	</ui-position>
	<div
		v-else
		:class="classes.segment"
		:style="{ width: props.width }"
	></div>
</template>

<style module="classes">
.segment {
	height: 4px;
	background-color: v-bind(color);
	border-radius: var(--radius-full, 9999px);
}

.inner {
	width: 100%;
}

.title {
	padding: 6px 8px;
	font-size: 14px;
}
</style>
