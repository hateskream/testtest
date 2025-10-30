<script setup lang="ts">
import { ModalItem } from '@/modules/widgets/base';
import { type IconIds, UiIcon } from '@/shared/ui/icon';

const props = defineProps<{
	icon: IconIds;
	label: string;
	disabled?: boolean;
}>();
</script>
<template>
	<modal-item
		:class="[classes.action, {[classes.disabled]: props.disabled}]"
	>
		<div :class="classes.label">
			<ui-icon
				:id="props.icon"
				width="16"
				height="16"
				:class="classes.icon"
			/>
			<span>{{label}}</span>
		</div>
	</modal-item>
</template>

<style module="classes">
.action:hover {
	background: var(--metrics-bg-control-300);
}

.disabled {
	pointer-events: none;
	opacity: .5;
}

.label {
	display: flex;
	gap: 6px;
	align-items: center;
}

.icon {
	color: var(--icon-color-base-300);
}
</style>
