<script setup lang="ts">
import {
	ModalItem,
	ModalBadgeList,
} from '@/modules/widgets/base';
import { UiPosition } from '@/shared/ui/position';
import { IconIds, UiIcon } from '@/shared/ui/icon';

const emits = defineEmits<{
	(e: 'delete'): void;
}>();

defineProps<{
	displayVariant: 'default' | 'new';
}>();
</script>

<template>
	<ui-position
		:trigger="['click', 'hover']"
		:close-delay="400"
	>
		<template #title>
			<ui-icon
				:id="IconIds.ControlMore"
				:class="classes.icon"
			/>
		</template>
		<template #content>
			<modal-badge-list :display-variant>
				<template #title>Dashboard settings</template>
				<template #default>
					<modal-item
						:class="classes.item"
						@click="emits('delete')"
					>
						Delete
					</modal-item>
				</template>
			</modal-badge-list>
		</template>
	</ui-position>
</template>

<style module="classes">
.item {
	cursor: pointer;
}

.icon {
	color: #646568;
	cursor: pointer;
}

.icon:hover {
	color: #ffffff;
}
</style>
