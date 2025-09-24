<script setup lang="ts">
import {
	ModalItemSelector,
	ModalBadgeList,
	ModalItemInteraction,
	ModalItemCheckbox,
} from '@/modules/widgets/base';
import type {
	ISingleSetting,
	ISettings,
} from '../model';
import { TitleViewVariant } from '../model';
import { UiPosition } from '@/shared/ui/position';

interface IProps {
	activeDisplayValue: ISettings;
}

const props = defineProps<IProps>();

const displayValue = defineModel<ISingleSetting>('displayValue', { required: true });
const isShowLogo = defineModel<boolean>('isShowLogo', { required: true });
const title = defineModel<TitleViewVariant>('title', { required: true });

function updateDisplayValue(newDisplayValue: string) {
	displayValue.value.active = newDisplayValue;
}

function updateTitle(newTitle: TitleViewVariant) {
	title.value = newTitle;
}
</script>

<template>
	<modal-badge-list>
		<modal-item-checkbox
			v-model="isShowLogo"
		>
			Logo
		</modal-item-checkbox>
		<ui-position>
			<template #default>
				<modal-item-interaction>
					<div>
						Title : {{ title }}
					</div>
				</modal-item-interaction>
			</template>
			<template #content>
				<modal-badge-list>
					<template #default>
						<modal-item-selector
							v-for="t in TitleViewVariant"
							:key="t"
							:model-value="t === title"
							@update:model-value="updateTitle(t)"
						>
							{{ t }}
						</modal-item-selector>
					</template>
				</modal-badge-list>
			</template>
		</ui-position>
		<ui-position>
			<template #default>
				<modal-item-interaction>
					<div>
						Display value
						<span :class="classes.dot" />
						{{ props.activeDisplayValue.displayName }}
					</div>
				</modal-item-interaction>
			</template>
			<template #content>
				<modal-badge-list>
					<template #default>
						<modal-item-selector
							v-for="dv in displayValue.values"
							:key="dv.key"
							:model-value="dv.key === displayValue.active"
							@update:model-value="updateDisplayValue(dv.key)"
						>
							{{ dv.displayName }}
						</modal-item-selector>
					</template>
				</modal-badge-list>
			</template>
		</ui-position>
	</modal-badge-list>
</template>

<style module="classes">
.dot {
	width: 1px;
	height: 1px;
	border: 1px solid var(--color-text-base-300, #9a9a9d);
	border-radius: 100%;
}
</style>
