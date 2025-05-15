<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { ITableColumn, ITableColumnDirection } from '../../model';
import { UiTooltip } from '@/shared/ui/tooltip';

interface IProps {
	column: ITableColumn;
	sortDirection: ITableColumnDirection;
}

const props = defineProps<IProps>();

const iconStyles = computed(() => ({
	transform: props.sortDirection === -1 ? 'rotate(180deg)' : '',
}));

const columnStyles = computed(() => ({
	justifyContent:
		['image', 'image-string'].includes(props.column.type) || props.column.position === 0
			? 'flex-start'
			: 'flex-end',
}));
</script>

<template>
	<ui-tooltip>
		<template #default>
			<div
				:class="classes.iconWrapper"
				:style="columnStyles"
			>
				<span>{{ column.displayShortColumnName }}</span>

				<ui-icon
					v-show="sortDirection !== 0"
					:id="IconIds.DropdownDown"
					:class="classes.icon"
					width="12"
					height="12"
					:style="iconStyles"
				/>
			</div>
		</template>

		<template #content>
			Click to sort by
			{{ column.displayColumnName.toLowerCase() }}
		</template>
	</ui-tooltip>
</template>

<style module="classes">
.iconWrapper {
	display: flex;
	align-items: center;
	width: 100%;
	transition: color 0.3s ease-in;
	gap: 4px;
}

.iconWrapper > span {
	display: flex;
}

.icon {
	color: #ffffff;
}

.iconWrapper:hover {
	color: var(--text-color-base-100-activated);
}
</style>
