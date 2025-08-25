<script setup lang="ts">
import {
	ModalBadge,
	ModalItemSelector,
	ModalBadgeList,
} from '@/modules/widgets/base';
import type { ISettings, ISingleSetting } from '../model';
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface IProps {
	title: string;
	active: ISettings;
}

const props = defineProps<IProps>();

const setting = defineModel<ISingleSetting>('setting', { required: true });

function update(newValue: string) {
	setting.value.active = newValue;
}
</script>

<template>
	<modal-badge class="setting-modal">
		<template #title="{ isVisible }">
			{{ props.active.displayName }}

			<ui-icon
				:id="IconIds.DropdownDown"
				width="12"
				height="12"
				:class="['dropdown-icon', { 'rotated': isVisible }]"
			/>
		</template>
		<template #content>
			<modal-badge-list>
				<template #title>{{ props.title }}</template>
				<template #default>
					<modal-item-selector
						v-for="s in setting.values"
						:key="s.key"
						:model-value="s.key === setting.active"
						@update:model-value="update(s.key)"
					>
						{{ s.displayName }}
					</modal-item-selector>
				</template>
			</modal-badge-list>
		</template>
	</modal-badge>
</template>

<style scoped>
.dropdown-icon {
	transition: transform 0.3s ease;

	&.rotated {
		transform: rotate(-180deg);
	}
}

.setting-modal {
	&:hover {
		.dropdown-icon {
			color: rgb(255 255 255 / 100%);
		}
	}
}
</style>
