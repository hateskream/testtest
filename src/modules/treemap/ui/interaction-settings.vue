<script setup lang="ts">
import { ModalBadgeList, ModalItemSelector, ModalSubmenu } from '@/modules/widgets/base';
import type { ISettings, ISingleSetting } from '../model';

interface IProps {
	title: string;
	active: ISettings;
}

const props = defineProps<IProps>();

const setting = defineModel<ISingleSetting>({ required: true });

function update(newValue: string) {
	setting.value = {
		...setting.value,
		active: newValue,
	};
}
</script>

<template>
	<modal-submenu>
		<template #title>
			<div>
				{{ props.title }}
				<span :class="classes.dot">
					·
				</span>
				{{ props.active.displayName }}
			</div>
		</template>
		<template #content>
			<modal-badge-list>
				<template #default>
					<modal-item-selector
						v-for="dv in setting.values"
						:key="dv.key"
						:model-value="dv.key === setting.active"
						@update:model-value="update(dv.key)"
					>
						{{ dv.displayName }}
					</modal-item-selector>
				</template>
			</modal-badge-list>
		</template>
	</modal-submenu>
</template>

<style module="classes">
.dot {
	width: 1px;
	height: 1px;
}
</style>
